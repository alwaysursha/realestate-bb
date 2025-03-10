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

  // Handle authentication state changes
  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      
      if (!mounted) return;

      try {
        if (firebaseUser) {
          // Check if the user is the admin
          if (firebaseUser.email === ADMIN_EMAIL) {
            console.log('Admin user authenticated');
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin User',
              email: firebaseUser.email || ADMIN_EMAIL,
              role: 'admin'
            });
          } else {
            console.log('User is not an admin, logging out');
            await signOut(auth);
            setUser(null);
            toast.error('You do not have admin privileges');
          }
        } else {
          console.log('No user authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (isLoading) return;

    const handleRouting = async () => {
      if (!pathname) return;

      // Only handle routing for admin paths
      if (!pathname.startsWith('/admin')) return;

      console.log('Handling admin routing:', { pathname, isAuthenticated: !!user });

      // If at admin root, redirect appropriately
      if (pathname === '/admin' || pathname === '/admin/') {
        if (user) {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/admin/login');
        }
        return;
      }

      // If not authenticated and not on login page, redirect to login
      if (!user && pathname !== '/admin/login') {
        console.log('Redirecting to login page');
        router.replace('/admin/login');
        return;
      }

      // If authenticated and on login page, redirect to dashboard
      if (user && pathname === '/admin/login') {
        console.log('Redirecting to dashboard');
        router.replace('/admin/dashboard');
        return;
      }
    };

    handleRouting();
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (email !== ADMIN_EMAIL) {
        throw new Error('You do not have admin privileges');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser.email !== ADMIN_EMAIL) {
        await signOut(auth);
        throw new Error('You do not have admin privileges');
      }

      const userData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Admin User',
        email: firebaseUser.email || email,
        role: 'admin'
      };
      
      setUser(userData);
      toast.success('Login successful');
      // Let the routing effect handle the redirect
    } catch (error: any) {
      console.error('Error in login function:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
      router.replace('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    } finally {
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