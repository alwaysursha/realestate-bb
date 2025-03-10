'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {}
});

// Mock admin credentials
const MOCK_ADMIN = {
  email: 'teamalisyed@gmail.com',
  password: 'admin123'
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize mock auth state
  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing mock auth');
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('Server-side rendering, skipping auth initialization');
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        // Check if we have a stored user
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Found stored user:', parsedUser.email);
            setUser(parsedUser);
          } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.removeItem('adminUser');
          }
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (!isInitialized || isLoading) {
      console.log('Auth not initialized or still loading, skipping routing');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('Server-side rendering, skipping routing');
      return;
    }

    if (!pathname) {
      console.log('No pathname available, skipping routing');
      return;
    }

    if (!pathname.startsWith('/admin')) {
      console.log('Not an admin path, skipping routing');
      return;
    }

    console.log('Handling routing:', { pathname, isAuthenticated: !!user });

    const isLoginPage = pathname === '/admin/login';
    const isRootAdminPage = pathname === '/admin' || pathname === '/admin/';

    const shouldRedirectToDashboard = user && (isLoginPage || isRootAdminPage);
    const shouldRedirectToLogin = !user && !isLoginPage;

    if (shouldRedirectToDashboard) {
      console.log('Redirecting to dashboard');
      router.replace('/admin/dashboard');
    } else if (shouldRedirectToLogin) {
      console.log('Redirecting to login');
      router.replace('/admin/login');
    }
  }, [user, isLoading, isInitialized, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting mock login:', { email });
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        const userData = {
          id: '1',
          name: 'Admin User',
          email: MOCK_ADMIN.email,
          role: 'admin'
        };
        // Store user in localStorage
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setUser(userData);
        console.log('Login successful');
        toast.success('Login successful');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Clear stored user
      localStorage.removeItem('adminUser');
      setUser(null);
      toast.success('Logged out successfully');
      // Redirect to login page
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || !isInitialized,
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
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 