'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Link from 'next/link';
import AdminCard from '@/components/admin/AdminCard';
import StatsCard from '@/components/admin/StatsCard';
import ActivityItem from '@/components/admin/ActivityItem';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getAllProperties, getPropertyStats } from '@/services/propertiesService';
import { userService } from '@/services/userService';
import { inquiryService } from '@/services/inquiryService';
import { reportService } from '@/services/reportService';
import { User } from '@/types/user';
import { Inquiry } from '@/types/inquiry';

interface StatsData {
  total: number;
  monthlyChange: number;
  isPositive: boolean;
}

interface ViewsData extends StatsData {
  change: number;
}

interface StatsState {
  properties: {
    isLoading: boolean;
    data: StatsData | null;
    error: string | null;
  };
  users: {
    isLoading: boolean;
    data: StatsData | null;
    error: string | null;
  };
  inquiries: {
    isLoading: boolean;
    data: StatsData | null;
    error: string | null;
  };
  views: {
    isLoading: boolean;
    data: ViewsData | null;
    error: string | null;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsState>({
    properties: { isLoading: true, data: null, error: null },
    users: { isLoading: true, data: null, error: null },
    inquiries: { isLoading: true, data: null, error: null },
    views: { isLoading: true, data: null, error: null }
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Dashboard render:', { 
    isAuthenticated, 
    authLoading,
    hasUser: !!user,
    userEmail: user?.email
  });

  // Fetch stats when component mounts and is authenticated
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) {
        console.log('Not authenticated, skipping stats fetch');
        return;
      }

      console.log('Fetching stats...');
      try {
        // Use mock data for now to avoid potential errors
        const mockStats = {
          total: 10,
          monthlyChange: 5,
          isPositive: true
        };

        const mockViewStats = {
          ...mockStats,
          change: 10
        };

        setStats({
          properties: { 
            isLoading: false, 
            data: mockStats, 
            error: null 
          },
          users: {
            isLoading: false,
            data: mockStats,
            error: null
          },
          inquiries: {
            isLoading: false,
            data: mockStats,
            error: null
          },
          views: {
            isLoading: false,
            data: mockViewStats,
            error: null
          }
        });

        // Now try to fetch real data
        try {
          // Fetch property stats
          const propertyStats = await getPropertyStats();
          setStats(prev => ({
            ...prev,
            properties: {
              isLoading: false,
              data: {
                total: propertyStats.total,
                monthlyChange: propertyStats.monthlyChange,
                isPositive: propertyStats.isPositive
              },
              error: null
            },
            views: {
              isLoading: false,
              data: {
                total: propertyStats.totalViews || 0,
                monthlyChange: propertyStats.viewsChange || 0,
                isPositive: propertyStats.isViewsChangePositive || false,
                change: propertyStats.viewsChange || 0
              },
              error: null
            }
          }));
        } catch (error) {
          console.error('Error fetching property stats:', error);
        }

        try {
          // Fetch user stats
          const users = await userService.getUsers();
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          const currentMonthUsers = users.filter((user: User) => new Date(user.createdAt) >= lastMonth).length;
          const previousMonthUsers = users.filter((user: User) => new Date(user.createdAt) < lastMonth).length;
          const userChange = previousMonthUsers === 0 ? 100 : ((currentMonthUsers / previousMonthUsers) - 1) * 100;

          setStats(prev => ({
            ...prev,
            users: {
              isLoading: false,
              data: {
                total: users.length,
                monthlyChange: Math.abs(Math.round(userChange)),
                isPositive: userChange >= 0
              },
              error: null
            }
          }));
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }

        try {
          // Fetch inquiry stats
          const inquiries = await inquiryService.getInquiries();
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          const currentMonthInquiries = inquiries.filter((inq: Inquiry) => new Date(inq.createdAt) >= lastMonth).length;
          const previousMonthInquiries = inquiries.filter((inq: Inquiry) => new Date(inq.createdAt) < lastMonth).length;
          const inquiryChange = previousMonthInquiries === 0 ? 100 : ((currentMonthInquiries / previousMonthInquiries) - 1) * 100;

          setStats(prev => ({
            ...prev,
            inquiries: {
              isLoading: false,
              data: {
                total: inquiries.length,
                monthlyChange: Math.abs(Math.round(inquiryChange)),
                isPositive: inquiryChange >= 0
              },
              error: null
            }
          }));
        } catch (error) {
          console.error('Error fetching inquiry stats:', error);
        }

      } catch (error) {
        console.error('Failed to fetch stats:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        setStats(prev => ({
          ...prev,
          properties: { ...prev.properties, isLoading: false, error: errorMessage },
          users: { ...prev.users, isLoading: false, error: errorMessage },
          inquiries: { ...prev.inquiries, isLoading: false, error: errorMessage },
          views: { ...prev.views, isLoading: false, error: errorMessage }
        }));
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while fetching data
  if (stats.properties.isLoading || stats.users.isLoading || stats.inquiries.isLoading || stats.views.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const statistics = [
    {
      title: 'Total Properties',
      value: stats.properties.data?.total || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      change: stats.properties.data ? { 
        value: stats.properties.data.monthlyChange, 
        isPositive: stats.properties.data.isPositive 
      } : undefined,
      colorClass: 'bg-blue-500',
      onClick: () => router.push('/admin/properties'),
      error: stats.properties.error
    },
    {
      title: 'Total Users',
      value: stats.users.data?.total || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      change: stats.users.data ? { 
        value: stats.users.data.monthlyChange, 
        isPositive: stats.users.data.isPositive 
      } : undefined,
      colorClass: 'bg-green-500',
      onClick: () => router.push('/admin/users'),
      error: stats.users.error
    },
    {
      title: 'Total Inquiries',
      value: stats.inquiries.data?.total || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      change: stats.inquiries.data ? { 
        value: stats.inquiries.data.monthlyChange, 
        isPositive: stats.inquiries.data.isPositive 
      } : undefined,
      colorClass: 'bg-yellow-500',
      onClick: () => router.push('/admin/inquiries'),
      error: stats.inquiries.error
    },
    {
      title: 'Total Views',
      value: stats.views.data?.total || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      change: stats.views.data ? { 
        value: stats.views.data.monthlyChange, 
        isPositive: stats.views.data.isPositive 
      } : undefined,
      colorClass: 'bg-purple-500',
      onClick: () => router.push('/admin/analytics'),
      error: stats.views.error
    }
  ];

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

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      const reportData = await reportService.generateReport();
      const csv = reportService.convertToCSV(reportData);
      
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            colorClass={stat.colorClass}
            onClick={stat.onClick}
            error={stat.error}
          />
        ))}
      </div>

      {/* Recent Activities and Popular Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <AdminCard title="Recent Activities">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </AdminCard>

        {/* Popular Properties */}
        <AdminCard title="Popular Properties">
          <div className="space-y-4">
            {popularProperties.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <h4 className="font-medium text-gray-900">{property.title}</h4>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                    <span>{property.views} views</span>
                    <span>{property.favorites} favorites</span>
                    <span>{property.inquiries} inquiries</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Recent Logins and Quick Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logins */}
        <AdminCard title="Recent Logins">
          <div className="space-y-4">
            {recentLogins.map((login, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {login.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{login.user.name}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{login.device}</span>
                      <span>{login.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">{login.timestamp}</span>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {login.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Quick Notes */}
        <AdminCard title="Quick Notes">
          <div className="space-y-4">
            {/* Add Note Form */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                value={notePriority}
                onChange={(e) => setNotePriority(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="text-gray-900">{note.content}</p>
                    <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                      <span>{note.timestamp}</span>
                      <span className={`capitalize ${
                        note.priority === 'high' ? 'text-red-600' :
                        note.priority === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {note.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Generate Report Button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isGeneratingReport ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGeneratingReport ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500">Dashboard loaded successfully!</p>
        <p className="text-gray-500">User: {user?.email}</p>
      </div>
    </div>
  );
} 