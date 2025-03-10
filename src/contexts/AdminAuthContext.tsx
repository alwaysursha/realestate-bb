'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '@/services/firebase';
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
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin email for validation
const ADMIN_EMAIL = 'teamalisyed@gmail.com';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  console.log('AdminAuthProvider render:', { pathname, isLoading, isAuthenticated: !!user });

  // Handle authentication state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        email: firebaseUser?.email,
        mounted 
      });
      
      if (!mounted) {
        console.log('Component unmounted, skipping state update');
        return;
      }

      try {
        if (firebaseUser) {
          // Check if the user is the admin
          if (firebaseUser.email === ADMIN_EMAIL) {
            console.log('Admin user authenticated, setting user data');
            const userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin User',
              email: firebaseUser.email || ADMIN_EMAIL,
              role: 'admin'
            };
            setUser(userData);
            setIsLoading(false);
            console.log('User data set:', userData);
          } else {
            console.log('User is not an admin, logging out');
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
            toast.error('You do not have admin privileges');
          }
        } else {
          console.log('No user authenticated, clearing user data');
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setIsLoading(false);
      }
    });
    
    return () => {
      console.log('Cleaning up auth state listener');
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (isLoading) {
      console.log('Still loading, skipping routing');
      return;
    }

    const handleRouting = async () => {
      if (!pathname) {
        console.log('No pathname available');
        return;
      }

      // Only handle routing for admin paths
      if (!pathname.startsWith('/admin')) {
        console.log('Not an admin path, skipping routing');
        return;
      }

      console.log('Handling admin routing:', { 
        pathname, 
        isAuthenticated: !!user,
        currentUser: user?.email 
      });

      // If at admin root, redirect appropriately
      if (pathname === '/admin' || pathname === '/admin/') {
        if (user) {
          console.log('At admin root with user, redirecting to dashboard');
          router.replace('/admin/dashboard');
        } else {
          console.log('At admin root without user, redirecting to login');
          router.replace('/admin/login');
        }
        return;
      }

      // If not authenticated and not on login page, redirect to login
      if (!user && pathname !== '/admin/login') {
        console.log('Not authenticated and not on login, redirecting to login');
        router.replace('/admin/login');
        return;
      }

      // If authenticated and on login page, redirect to dashboard
      if (user && pathname === '/admin/login') {
        console.log('Authenticated and on login page, redirecting to dashboard');
        router.replace('/admin/dashboard');
        return;
      }
    };

    handleRouting();
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt:', { email });
      setIsLoading(true);
      
      if (email !== ADMIN_EMAIL) {
        console.log('Not admin email, rejecting');
        throw new Error('You do not have admin privileges');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser.email !== ADMIN_EMAIL) {
        console.log('Firebase user not admin, logging out');
        await signOut(auth);
        throw new Error('You do not have admin privileges');
      }

      console.log('Login successful');
      toast.success('Login successful');
      // Let the auth state listener handle setting the user
    } catch (error: any) {
      console.error('Error in login function:', error);
      setIsLoading(false);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      setIsLoading(true);
      await signOut(auth);
      // Let the auth state listener handle clearing the user
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
      setIsLoading(false);
    }
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