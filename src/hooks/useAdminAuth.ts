import { useState, useEffect } from 'react';

interface AdminAuth {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAdminAuth(): AdminAuth {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For now, we'll assume the user is authenticated
        // In a real application, you would check the session/token here
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
} 