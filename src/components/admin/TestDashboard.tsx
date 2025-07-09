import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import DebugAuth from './DebugAuth';

const TestDashboard = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Test Dashboard
      </h1>
      
      <div className="space-y-4">
        <DebugAuth />
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Authentication Status
          </h2>
          <p className="text-blue-800 dark:text-blue-200">
            Is Authenticated: <span className="font-mono">{isAuthenticated ? 'true' : 'false'}</span>
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            User Role: <span className="font-mono">{user?.role || 'none'}</span>
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            User Email: <span className="font-mono">{user?.email || 'none'}</span>
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Dashboard Access
          </h2>
          <p className="text-green-800 dark:text-green-200">
            If you can see this, the dashboard routing is working correctly!
          </p>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Next Steps
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200">
            If authentication is working, you should be able to access the main dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard; 