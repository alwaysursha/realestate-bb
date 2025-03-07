'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to the dashboard page if authenticated
        router.push('/admin/dashboard/');
      } else {
        // Redirect to the login page if not authenticated
        router.push('/admin/login/');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-700">Redirecting...</p>
      </div>
    </div>
  );
} 