import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const DebugAuth = () => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    console.log('DebugAuth: Checking authentication...');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('DebugAuth: Auth state changed:', {
      isAuthenticated,
      user,
      isLoading
    });
  }, [isAuthenticated, user, isLoading]);

  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
        🔍 Authentication Debug Info
      </h2>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Loading:</span>
          <span className="font-mono">{isLoading ? 'true' : 'false'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Authenticated:</span>
          <span className="font-mono">{isAuthenticated ? 'true' : 'false'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">User Role:</span>
          <span className="font-mono">{user?.role || 'none'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">User Email:</span>
          <span className="font-mono">{user?.email || 'none'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Can Access Admin:</span>
          <span className="font-mono">
            {isAuthenticated && user?.role === 'admin' ? 'true' : 'false'}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          <strong>Note:</strong> Check browser console for detailed logs.
        </p>
      </div>
    </div>
  );
};

export default DebugAuth; 