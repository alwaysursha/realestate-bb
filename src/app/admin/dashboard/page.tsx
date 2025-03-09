'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Link from 'next/link';
import AdminCard from '@/components/admin/AdminCard';
import StatsCard from '@/components/admin/StatsCard';
import ActivityItem from '@/components/admin/ActivityItem';
import { getAllProperties, getPropertyStats, clearAndReinitializeProperties } from '@/services/propertiesService';
import { userService } from '@/services/userService';
import { inquiryService } from '@/services/inquiryService';
import { reportService } from '@/services/reportService';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [monthlyChange, setMonthlyChange] = useState<number>(0);
  const [isPositiveChange, setIsPositiveChange] = useState<boolean>(true);
  const [isLoadingProperties, setIsLoadingProperties] = useState<boolean>(true);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [userChange, setUserChange] = useState<number>(0);
  const [isPositiveUserChange, setIsPositiveUserChange] = useState<boolean>(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [inquiryChange, setInquiryChange] = useState<number>(0);
  const [isPositiveInquiryChange, setIsPositiveInquiryChange] = useState<boolean>(true);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState<boolean>(true);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [viewsChange, setViewsChange] = useState<number>(0);
  const [isViewsChangePositive, setIsViewsChangePositive] = useState<boolean>(true);
  const [isLoadingViews, setIsLoadingViews] = useState<boolean>(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Initialize mock data
  useEffect(() => {
    const initializeMockData = async () => {
      await inquiryService.initializeMockData();
      // Reset properties to get more realistic view counts
      await clearAndReinitializeProperties();
    };
    initializeMockData();
  }, []);

  // Fetch property and user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch property stats
        const propertyStats = await getPropertyStats();
        setTotalProperties(propertyStats.total);
        setMonthlyChange(propertyStats.monthlyChange);
        setIsPositiveChange(propertyStats.isPositive);
        
        // Set view stats
        if (propertyStats.totalViews !== undefined) {
          setTotalViews(propertyStats.totalViews);
          setViewsChange(propertyStats.viewsChange || 0);
          setIsViewsChangePositive(propertyStats.isViewsChangePositive || true);
          setIsLoadingViews(false);
        }

        // Fetch user stats
        const userStats = await userService.getUserStats();
        setActiveUsers(userStats.total);
        setUserChange(userStats.monthlyChange);
        setIsPositiveUserChange(userStats.isPositive);

        // Fetch inquiry stats
        const inquiryStats = await inquiryService.getInquiryStats();
        setTotalInquiries(inquiryStats.total);
        setInquiryChange(inquiryStats.monthlyChange);
        setIsPositiveInquiryChange(inquiryStats.isPositive);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoadingProperties(false);
        setIsLoadingUsers(false);
        setIsLoadingInquiries(false);
      }
    };

    fetchStats();
  }, []);

  // Mock statistics data
  const statistics = [
    {
      title: 'Total Properties',
      value: isLoadingProperties ? '...' : totalProperties,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      change: { value: monthlyChange, isPositive: isPositiveChange },
      colorClass: 'bg-blue-500',
      onClick: () => router.push('/admin/properties')
    },
    {
      title: 'Active Users',
      value: isLoadingUsers ? '...' : activeUsers,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      change: { value: userChange, isPositive: isPositiveUserChange },
      colorClass: 'bg-green-500',
      onClick: () => router.push('/admin/users')
    },
    {
      title: 'New Inquiries',
      value: isLoadingInquiries ? '...' : totalInquiries,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      change: { value: inquiryChange, isPositive: isPositiveInquiryChange },
      colorClass: 'bg-purple-500',
      onClick: () => router.push('/admin/inquiries')
    },
    {
      title: 'Properties Viewed',
      value: isLoadingViews ? '...' : totalViews.toLocaleString(),
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      change: { value: viewsChange, isPositive: isViewsChangePositive },
      colorClass: 'bg-yellow-500',
      onClick: () => router.push('/admin/analytics')
    },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      user: { name: 'Jessica Williams', avatar: '/images/avatars/agent-3.jpg' },
      action: 'added a new property',
      target: 'Luxury Villa in Palm Jumeirah',
      timestamp: '2 hours ago',
      iconColor: 'bg-green-500',
    },
    {
      user: { name: 'John Doe', avatar: '/images/avatars/avatar-1.jpg' },
      action: 'favorited',
      target: 'The Grand Residences',
      timestamp: '4 hours ago',
      iconColor: 'bg-yellow-500',
    },
    {
      user: { name: 'Sarah Brown', avatar: '/images/avatars/avatar-6.jpg' },
      action: 'submitted an inquiry for',
      target: 'Modern Apartment in Downtown',
      timestamp: '6 hours ago',
      iconColor: 'bg-blue-500',
    },
    {
      user: { name: 'Michael Wilson', avatar: '/images/avatars/avatar-5.jpg' },
      action: 'updated user settings for',
      target: 'Admin Dashboard',
      timestamp: '1 day ago',
      iconColor: 'bg-purple-500',
    },
    {
      user: { name: 'Lisa Taylor', avatar: '/images/avatars/avatar-8.jpg' },
      action: 'signed up as a new user',
      target: '',
      timestamp: '2 days ago',
      iconColor: 'bg-green-500',
    },
  ];

  // Mock popular properties
  const popularProperties = [
    {
      title: 'The Grand Residences',
      views: 1245,
      favorites: 89,
      inquiries: 32,
    },
    {
      title: 'Luxury Villa in Palm Jumeirah',
      views: 1120,
      favorites: 76,
      inquiries: 28,
    },
    {
      title: 'Modern Apartment in Downtown',
      views: 980,
      favorites: 65,
      inquiries: 24,
    },
    {
      title: 'Beachfront Condo in JBR',
      views: 875,
      favorites: 54,
      inquiries: 19,
    },
    {
      title: 'Family Home in Arabian Ranches',
      views: 760,
      favorites: 48,
      inquiries: 15,
    },
  ];

  // Mock recent logins
  const recentLogins = [
    {
      user: { name: 'John Doe', avatar: '/images/avatars/avatar-1.jpg' },
      device: 'Desktop - Chrome',
      location: 'Dubai, UAE',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      user: { name: 'Sarah Brown', avatar: '/images/avatars/avatar-6.jpg' },
      device: 'Mobile - Safari',
      location: 'Abu Dhabi, UAE',
      timestamp: '5 hours ago',
      status: 'success',
    },
    {
      user: { name: 'Michael Wilson', avatar: '/images/avatars/avatar-5.jpg' },
      device: 'Tablet - Firefox',
      location: 'Sharjah, UAE',
      timestamp: '1 day ago',
      status: 'failed',
    },
    {
      user: { name: 'Lisa Taylor', avatar: '/images/avatars/avatar-8.jpg' },
      device: 'Desktop - Edge',
      location: 'Dubai, UAE',
      timestamp: '2 days ago',
      status: 'success',
    },
  ];

  // Mock notes
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'Schedule meeting with marketing team about new property launch',
      timestamp: '2023-03-15',
      priority: 'high',
    },
    {
      id: 2,
      content: 'Follow up with developers about project timeline updates',
      timestamp: '2023-03-14',
      priority: 'medium',
    },
    {
      id: 3,
      content: 'Review new property submissions from agents',
      timestamp: '2023-03-13',
      priority: 'low',
    },
  ]);
  const [newNote, setNewNote] = useState('');
  const [notePriority, setNotePriority] = useState('medium');

  // Add new note
  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const newNoteObj = {
      id: Date.now(),
      content: newNote,
      timestamp: new Date().toISOString().split('T')[0],
      priority: notePriority,
    };
    
    setNotes([newNoteObj, ...notes]);
    setNewNote('');
    setNotePriority('medium');
  };

  // Delete note
  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Generate and download report
  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      const reportData = await reportService.generateReport();
      const csv = reportService.convertToCSV(reportData);
      
      // Generate filename with current date
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const filename = `real-estate-report-${formattedDate}.csv`;
      
      reportService.downloadCSV(csv, filename);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // If still loading authentication state, show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't render the page content
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      {/* Page title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-3 sm:mt-0">
          <button 
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center ${isGeneratingReport ? 'opacity-75 cursor-not-allowed' : ''}`}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            colorClass={stat.colorClass}
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <AdminCard
          title="Recent Activity"
          footer={
            <div className="text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all activity
              </button>
            </div>
          }
        >
          <div className="space-y-5">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                user={activity.user}
                action={activity.action}
                target={activity.target}
                timestamp={activity.timestamp}
                iconColor={activity.iconColor}
              />
            ))}
          </div>
        </AdminCard>

        {/* Popular Properties */}
        <AdminCard title="Popular Properties">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularProperties.map((property, index) => (
                  <tr key={index}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.title}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.views}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.favorites}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.inquiries}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {/* Recent Logins */}
        <AdminCard title="Recent Logins">
          <div className="space-y-4">
            {recentLogins.map((login, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {login.user.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={login.user.avatar}
                        alt={login.user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {login.user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{login.user.name}</p>
                    <p className="text-xs text-gray-500">{login.device}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{login.location}</p>
                  <p className="text-xs text-gray-500">{login.timestamp}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {login.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Notes */}
        <AdminCard title="Notes & Reminders">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={notePriority}
                onChange={(e) => setNotePriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      note.priority === 'high' ? 'bg-red-100 text-red-800' :
                      note.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{note.content}</p>
                  <p className="mt-1 text-xs text-gray-500">{note.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* Monthly Stats */}
        <AdminCard title="Monthly Statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">New Users</h3>
              <div className="flex items-end space-x-2">
                <div className="bg-blue-500 w-4 h-20 rounded-t-sm"></div>
                <div className="bg-blue-500 w-4 h-24 rounded-t-sm"></div>
                <div className="bg-blue-500 w-4 h-16 rounded-t-sm"></div>
                <div className="bg-blue-500 w-4 h-28 rounded-t-sm"></div>
                <div className="bg-blue-500 w-4 h-32 rounded-t-sm"></div>
                <div className="bg-blue-500 w-4 h-24 rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Property Listings</h3>
              <div className="flex items-end space-x-2">
                <div className="bg-green-500 w-4 h-16 rounded-t-sm"></div>
                <div className="bg-green-500 w-4 h-20 rounded-t-sm"></div>
                <div className="bg-green-500 w-4 h-28 rounded-t-sm"></div>
                <div className="bg-green-500 w-4 h-24 rounded-t-sm"></div>
                <div className="bg-green-500 w-4 h-32 rounded-t-sm"></div>
                <div className="bg-green-500 w-4 h-36 rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Inquiries</h3>
              <div className="flex items-end space-x-2">
                <div className="bg-purple-500 w-4 h-24 rounded-t-sm"></div>
                <div className="bg-purple-500 w-4 h-16 rounded-t-sm"></div>
                <div className="bg-purple-500 w-4 h-20 rounded-t-sm"></div>
                <div className="bg-purple-500 w-4 h-28 rounded-t-sm"></div>
                <div className="bg-purple-500 w-4 h-32 rounded-t-sm"></div>
                <div className="bg-purple-500 w-4 h-24 rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Revenue (AED)</h3>
              <div className="flex items-end space-x-2">
                <div className="bg-yellow-500 w-4 h-20 rounded-t-sm"></div>
                <div className="bg-yellow-500 w-4 h-28 rounded-t-sm"></div>
                <div className="bg-yellow-500 w-4 h-32 rounded-t-sm"></div>
                <div className="bg-yellow-500 w-4 h-36 rounded-t-sm"></div>
                <div className="bg-yellow-500 w-4 h-40 rounded-t-sm"></div>
                <div className="bg-yellow-500 w-4 h-44 rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Property Views */}
        <AdminCard title="Recent Property Views">
          <div className="space-y-4">
            {popularProperties.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{property.title}</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Views today:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (property.views / 15))}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">{Math.floor(property.views / 10)}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
} 