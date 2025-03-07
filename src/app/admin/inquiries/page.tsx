'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { inquiryService } from '@/services/inquiryService';
import { Inquiry, InquiryStatus } from '@/types/inquiry';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function InquiriesPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        await inquiryService.initializeMockData();
        const data = await inquiryService.getInquiries();
        setInquiries(data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        toast.error('Failed to load inquiries');
      } finally {
        setIsLoadingInquiries(false);
      }
    };

    if (isAuthenticated) {
      fetchInquiries();
    }
  }, [isAuthenticated]);

  const filteredInquiries = inquiries
    .filter(inquiry => {
      const matchesSearch = 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.propertySnapshot.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return sortOrder === 'desc'
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status);
      }
    });

  if (isLoading || isLoadingInquiries) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Inquiries Management</h1>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'All')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                />
              </svg>
              <p className="text-gray-500 text-lg">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={inquiry.propertySnapshot.mainImage}
                            alt={inquiry.propertySnapshot.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {inquiry.propertySnapshot.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${inquiry.propertySnapshot.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          inquiry.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 