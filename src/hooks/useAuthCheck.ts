import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuthCheck = () => {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Only check authentication if not already authenticated
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  return { isAuthenticated, isLoading };
}; 