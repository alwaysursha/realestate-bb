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

  // Check if user is authenticated on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      
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
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isLoading) {
      console.log('Redirection check - Auth state:', { 
        isAuthenticated: !!user, 
        pathname, 
        user: user ? 'User exists' : 'No user' 
      });
      
      // If at the root admin path, redirect to login or dashboard
      if (pathname === '/admin' || pathname === '/admin/') {
        if (user) {
          router.push('/admin/dashboard');
        } else {
          router.push('/admin/login');
        }
        return;
      }
      
      // If not authenticated and trying to access admin routes (except login)
      if (!user && pathname && pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
        console.log('Not authenticated, redirecting to login');
        router.push('/admin/login');
      }
      
      // If authenticated and trying to access login page
      if (user && pathname && pathname.includes('/admin/login')) {
        console.log('Already authenticated, redirecting to dashboard');
        router.push('/admin/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Login attempt started with:', email);
    
    try {
      // Check if the email is the admin email
      if (email !== ADMIN_EMAIL) {
        throw new Error('You do not have admin privileges');
      }
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Set user data
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Admin User',
        email: firebaseUser.email || email,
        role: 'admin'
      });
      
      console.log('Login successful');
      toast.success('Login successful');
      return;
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
      await signOut(auth);
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
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