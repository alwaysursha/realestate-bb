'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminCard from '../../../components/admin/AdminCard';

export default function AdminSettings() {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Builder Bookings',
    siteDescription: 'Real Estate Platform for UAE',
    contactEmail: 'contact@builderbookings.com',
    supportPhone: '+971 50 123 4567'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    newPropertyAlerts: true
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleGeneralSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these settings to your backend
    alert('General settings saved!');
  };
  
  const handleNotificationSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these settings to your backend
    alert('Notification settings saved!');
  };

  return (
    <div className="lg:pl-64 flex flex-col flex-1">
      <main className="flex-1 pb-8">
        <div className="mt-8 lg:mt-0 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            
            {/* General Settings */}
            <div className="mb-10">
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
              <form onSubmit={handleGeneralSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralSettingsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                      Site Description
                    </label>
                    <input
                      type="text"
                      name="siteDescription"
                      id="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralSettingsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralSettingsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      name="supportPhone"
                      id="supportPhone"
                      value={generalSettings.supportPhone}
                      onChange={handleGeneralSettingsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save General Settings
                  </button>
                </div>
              </form>
            </div>
            
            {/* Notification Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
              <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="smsNotifications"
                        name="smsNotifications"
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-gray-500">Receive notifications via SMS</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingEmails"
                        name="marketingEmails"
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                        Marketing Emails
                      </label>
                      <p className="text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="newPropertyAlerts"
                        name="newPropertyAlerts"
                        type="checkbox"
                        checked={notificationSettings.newPropertyAlerts}
                        onChange={handleNotificationSettingsChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="newPropertyAlerts" className="font-medium text-gray-700">
                        New Property Alerts
                      </label>
                      <p className="text-gray-500">Get notified when new properties are added</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 