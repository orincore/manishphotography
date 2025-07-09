import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const SimpleDashboard = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
          ✅ Simple Dashboard - Working!
        </h1>
        <p className="text-green-800 dark:text-green-200 mb-4">
          If you can see this, the admin routing and authentication are working correctly.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">Authentication Status:</h2>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-mono">isAuthenticated:</span> {isAuthenticated ? 'true' : 'false'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-mono">user.role:</span> {user?.role || 'none'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-mono">user.email:</span> {user?.email || 'none'}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Next Steps
        </h2>
        <ul className="text-blue-800 dark:text-blue-200 space-y-2">
          <li>• If authentication is working, try the main dashboard</li>
          <li>• Check the browser console for any errors</li>
          <li>• Try the "Test Debug" link in the sidebar</li>
          <li>• If issues persist, check the error boundary</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleDashboard; 