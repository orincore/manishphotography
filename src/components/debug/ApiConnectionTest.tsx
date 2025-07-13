import { useState } from 'react';
import api from '../../services/api';

const ApiConnectionTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: 'API Base URL Test',
        test: async () => {
          const response = await api.get('/');
          return { success: true, data: response.data };
        }
      },
      {
        name: 'Portfolio Categories Test',
        test: async () => {
          const response = await api.get('/portfolio/categories');
          return { success: true, data: response.data };
        }
      },
      {
        name: 'Portfolio Published Test',
        test: async () => {
          const response = await api.get('/portfolio/published');
          return { success: true, data: response.data };
        }
      },
      {
        name: 'Specific Project Test (73823f18-0708-4907-b687-c7aa9a33b66e)',
        test: async () => {
          const response = await api.get('/portfolio/project/73823f18-0708-4907-b687-c7aa9a33b66e');
          return { success: true, data: response.data };
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, { name: test.name, success: true, data: result.data }]);
      } catch (error: any) {
        setTestResults(prev => [...prev, { 
          name: test.name, 
          success: false, 
          error: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            data: error.response?.data
          }
        }]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className={`p-4 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.name} - {result.success ? 'PASS' : 'FAIL'}
            </h3>
            {result.success ? (
              <pre className="mt-2 text-sm text-green-700 overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <pre className="mt-2 text-sm text-red-700 overflow-auto">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
        <h4 className="font-semibold mb-2">Current API Configuration:</h4>
        <p className="text-sm">
          <strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://api.manishbosephotography.com/api'}
        </p>
        <p className="text-sm">
          <strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'https://api.manishbosephotography.com'}
        </p>
      </div>
    </div>
  );
};

export default ApiConnectionTest; 