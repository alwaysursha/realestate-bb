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
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {}
});

// Admin email for validation
const ADMIN_EMAIL = 'teamalisyed@gmail.com';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle authentication state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        email: firebaseUser?.email,
        mounted,
        isInitialized
      });
      
      if (!mounted) return;

      try {
        if (firebaseUser) {
          if (firebaseUser.email === ADMIN_EMAIL) {
            console.log('Admin user authenticated, setting user data');
            const userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin User',
              email: firebaseUser.email || ADMIN_EMAIL,
              role: 'admin'
            };
            setUser(userData);
          } else {
            console.log('User is not admin, clearing session');
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
        if (!isInitialized) {
          setIsInitialized(true);
        }
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
    if (!isInitialized || isLoading) {
      console.log('Auth not initialized or still loading, skipping routing');
      return;
    }

    if (!pathname?.startsWith('/admin')) {
      console.log('Not an admin path, skipping routing');
      return;
    }

    console.log('Handling routing:', { pathname, isAuthenticated: !!user });

    const isLoginPage = pathname === '/admin/login';
    const isRootAdminPage = pathname === '/admin' || pathname === '/admin/';

    if (user) {
      // User is authenticated
      if (isLoginPage || isRootAdminPage) {
        console.log('Authenticated user on login/root page, redirecting to dashboard');
        router.replace('/admin/dashboard');
      }
    } else {
      // User is not authenticated
      if (!isLoginPage) {
        console.log('Unauthenticated user not on login page, redirecting to login');
        router.replace('/admin/login');
      }
    }
  }, [user, isLoading, isInitialized, pathname]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login:', { email });
      setIsLoading(true);
      
      if (email !== ADMIN_EMAIL) {
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
      router.replace('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
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
      toast.success('Logged out successfully');
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