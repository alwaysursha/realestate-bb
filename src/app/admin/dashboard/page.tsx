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
  const { user, isAuthenticated, isLoading: authLoading } = useAdminAuth();
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize mock data only once when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !isInitialized) {
      const initializeMockData = async () => {
        try {
          await inquiryService.initializeMockData();
          await clearAndReinitializeProperties();
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize mock data:', error);
        }
      };
      initializeMockData();
    }
  }, [authLoading, isAuthenticated, isInitialized]);

  // Fetch stats only when initialized
  useEffect(() => {
    if (!isInitialized) return;

    const fetchStats = async () => {
      try {
        const propertyStats = await getPropertyStats();
        setTotalProperties(propertyStats.total);
        setMonthlyChange(propertyStats.monthlyChange);
        setIsPositiveChange(propertyStats.isPositive);
        
        if (propertyStats.totalViews !== undefined) {
          setTotalViews(propertyStats.totalViews);
          setViewsChange(propertyStats.viewsChange || 0);
          setIsViewsChangePositive(propertyStats.isViewsChangePositive || true);
          setIsLoadingViews(false);
        }

        const userStats = await userService.getUserStats();
        setActiveUsers(userStats.total);
        setUserChange(userStats.monthlyChange);
        setIsPositiveUserChange(userStats.isPositive);

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
  }, [isInitialized]);

  // Show loading state while authenticating or initializing
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Manage your real estate platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Properties Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>
          <p className="text-gray-600">Manage your property listings</p>
          <button
            onClick={() => router.push('/admin/properties')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Properties
          </button>
        </div>

        {/* Developers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Developers</h2>
          <p className="text-gray-600">Manage property developers</p>
          <button
            onClick={() => router.push('/admin/developers')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Developers
          </button>
        </div>

        {/* Agents Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Agents</h2>
          <p className="text-gray-600">Manage real estate agents</p>
          <button
            onClick={() => router.push('/admin/agents')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Agents
          </button>
        </div>

        {/* Inquiries Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inquiries</h2>
          <p className="text-gray-600">View and manage customer inquiries</p>
          <button
            onClick={() => router.push('/admin/inquiries')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Inquiries
          </button>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600">Manage user accounts</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Users
          </button>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-600">Configure system settings</p>
          <button
            onClick={() => router.push('/admin/settings')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            View Settings
          </button>
        </div>
      </div>
    </div>
  );
} 