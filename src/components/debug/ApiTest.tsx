import { useEffect, useState } from 'react';
import portfolioService, { PortfolioCategory } from '../../services/portfolioService';

const ApiTest = () => {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('Testing API connection...');
        
        const response = await portfolioService.getCategories();
        console.log('API Response:', response);
        
        setCategories(response.categories);
        setError(null);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Test - Loading...</h3>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">API Test - Error</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
        API Test - Success! ({categories.length} categories found)
      </h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="p-3 bg-white dark:bg-gray-800 rounded border">
            <h4 className="font-medium">{category.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>Slug: {category.slug}</span> | 
              <span> Order: {category.display_order}</span> | 
              <span> Active: {category.is_active ? 'Yes' : 'No'}</span> | 
              <span> Subcategories: {category.portfolio_subcategories.length}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
        <strong>API Endpoint:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://api.manishbosephotography.com/api'}/portfolio/categories
      </div>
    </div>
  );
};

export default ApiTest; 