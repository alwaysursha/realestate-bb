'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication on initial load');
      try {
        let token, storedUser;
        
        try {
          token = localStorage.getItem('adminToken');
          storedUser = localStorage.getItem('adminUser');
          console.log('localStorage check:', { 
            hasToken: !!token, 
            hasUser: !!storedUser 
          });
        } catch (storageError) {
          console.error('Error accessing localStorage:', storageError);
          token = null;
          storedUser = null;
        }
        
        if (token && storedUser) {
          console.log('Found stored credentials, parsing user data');
          try {
            const userData = JSON.parse(storedUser);
            console.log('Setting user state with stored data');
            setUser(userData);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        } else {
          console.log('No stored credentials found');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear any invalid data
        try {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        } catch (clearError) {
          console.error('Error clearing localStorage:', clearError);
        }
      } finally {
        console.log('Authentication check completed, setting isLoading to false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isLoading) {
      console.log('Redirection check - Auth state:', { 
        isAuthenticated: !!user, 
        pathname, 
        user: user ? 'User exists' : 'No user' 
      });
      
      // If not authenticated and trying to access admin routes (except login)
      if (!user && pathname && pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
        console.log('Not authenticated, redirecting to login');
        router.push('/admin/login/');
      }
      
      // If authenticated and trying to access login page
      if (user && pathname && pathname.includes('/admin/login')) {
        console.log('Already authenticated, redirecting to dashboard');
        router.push('/admin/dashboard/');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Login attempt started with:', email);
    
    try {
      // This is a simulation - in a real app, you would call your backend API
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          console.log('Checking credentials...');
          // For demo purposes, accept only this email/password
          if (email === 'admin@builderbookings.com' && password === 'admin123') {
            console.log('Credentials valid, creating user data');
            const userData = {
              id: 1,
              name: 'Admin User',
              email: email,
              role: 'admin'
            };
            
            // Store auth data
            console.log('Storing auth data in localStorage');
            try {
              localStorage.setItem('adminToken', 'sample-jwt-token-would-be-here');
              localStorage.setItem('adminUser', JSON.stringify(userData));
              console.log('Successfully stored data in localStorage');
            } catch (storageError) {
              console.error('Error storing data in localStorage:', storageError);
              // Continue anyway, as the user state will still be updated in memory
            }
            
            // Update state
            console.log('Updating user state');
            setUser(userData);
            console.log('Login successful, resolving promise');
            resolve();
          } else {
            console.log('Invalid credentials, rejecting promise');
            reject(new Error('Invalid email or password'));
          }
        }, 1000); // Simulate network delay
      });
    } catch (error) {
      console.error('Error in login function:', error);
      throw error;
    } finally {
      console.log('Login process completed, setting isLoading to false');
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Update state
    setUser(null);
    
    // Redirect to login
    router.push('/admin/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 