import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import adminService from '../../services/adminService';
import { PortfolioCategory } from '../../types';

const CategoriesList = () => {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching categories from API...');
      
      const response = await adminService.getCategories();
      console.log('Categories response:', response);
      
      setCategories(response.categories || []);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      setError(err.response?.data?.message || 'Failed to load categories');
      setCategories([]); // Ensure we always have an array
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categorySlug: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deleteCategory(categorySlug);
      fetchCategories(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your portfolio categories and subcategories
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first portfolio category.
            </p>
            <Link
              to="/admin/categories/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              <span>Create Category</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .filter(cat => Array.isArray(cat.portfolio_subcategories) && cat.portfolio_subcategories.length > 0)
            .map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Category Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {category.description}
                </p>
                
                {/* Subcategories Preview */}
                {category.portfolio_subcategories && Array.isArray(category.portfolio_subcategories) && category.portfolio_subcategories.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {category.portfolio_subcategories.slice(0, 3).map((sub) => (
                        <span key={sub.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {sub.name}
                        </span>
                      ))}
                      {category.portfolio_subcategories.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{category.portfolio_subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                  <span>Subcategories: {Array.isArray(category.portfolio_subcategories) ? category.portfolio_subcategories.length : 0}</span>
                  <span>Order: {category.display_order}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/categories/edit/${category.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => deleteCategory(category.slug)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList; 