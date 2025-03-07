'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { inquiryService } from '@/services/inquiryService';
import { Inquiry, InquiryStatus } from '@/types/inquiry';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const data = await inquiryService.getInquiryById(params.id);
        setInquiry(data);
      } catch (error) {
        console.error('Error fetching inquiry:', error);
        toast.error('Failed to load inquiry details');
      } finally {
        setIsLoadingInquiry(false);
      }
    };

    if (isAuthenticated) {
      fetchInquiry();
    }
  }, [params.id, isAuthenticated]);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!inquiry || !user) return;
    
    setIsUpdatingStatus(true);
    try {
      const updated = await inquiryService.updateInquiryStatus(inquiry.id, newStatus, user.email);
      if (updated) {
        setInquiry(updated);
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry || !user || !newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const updated = await inquiryService.addNote(inquiry.id, newNote.trim(), user.email);
      if (updated) {
        setInquiry(updated);
        setNewNote('');
        toast.success('Note added successfully');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (isLoading || isLoadingInquiry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Inquiry Not Found</h1>
          <p className="text-gray-600 mb-4">The inquiry you're looking for doesn't exist or has been deleted.</p>
          <Link
            href="/admin/inquiries"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Inquiries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
          <div>
            <Link
              href="/admin/inquiries"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Inquiries
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Inquiry Details
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={inquiry.status}
              onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
              disabled={isUpdatingStatus}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
              inquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              inquiry.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {inquiry.status}
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
          <div className="flex items-start space-x-4">
            <img
              src={inquiry.propertySnapshot.mainImage}
              alt={inquiry.propertySnapshot.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium text-gray-900">{inquiry.propertySnapshot.title}</h3>
              <p className="text-gray-600">{inquiry.propertySnapshot.location}</p>
              <p className="text-gray-900 font-medium mt-2">
                ${inquiry.propertySnapshot.price.toLocaleString()}
              </p>
              <Link
                href={`/properties/${inquiry.propertySnapshot.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 inline-block"
              >
                View Property →
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{inquiry.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{inquiry.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{inquiry.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Inquiry Date</p>
              <p className="font-medium text-gray-900">
                {inquiry.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <div className="space-y-4 mb-6">
            {inquiry.notes.length === 0 ? (
              <p className="text-gray-500 italic">No notes yet</p>
            ) : (
              inquiry.notes.map(note => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Added by {note.createdBy} on {note.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Add Note
              </label>
              <textarea
                id="note"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your note here..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmittingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        </div>

        {/* Status History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
          <div className="space-y-4">
            {inquiry.statusHistory.map((entry, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  entry.status === 'New' ? 'bg-blue-500' :
                  entry.status === 'In Progress' ? 'bg-yellow-500' :
                  entry.status === 'Resolved' ? 'bg-green-500' :
                  'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                  <p className="text-sm text-gray-500">
                    Changed by {entry.changedBy} on {entry.changedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 