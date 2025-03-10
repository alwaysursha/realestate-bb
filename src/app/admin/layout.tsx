'use client';

import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const pathname = usePathname();

  console.log('AdminLayoutContent render:', { isAuthenticated, isLoading, pathname, user });

  const isLoginPage = pathname === '/admin/login';

  // Show loading spinner while authentication is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For authenticated pages, show the admin layout
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // This case should not occur due to routing in AdminAuthContext
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutContent>
      {children}
    </AdminLayoutContent>
  );
} 