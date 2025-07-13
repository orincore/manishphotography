import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import feedbackService, { 
  Feedback, 
  FeedbackFilters, 
  FeedbackStats,
  ModerateFeedbackData,
  BulkModerateFeedbackData
} from '../../services/feedbackService';
import { showNotification } from '../../utils/notifications';

interface FeedbackManagerProps {
  className?: string;
}

const FeedbackManager: React.FC<FeedbackManagerProps> = ({ className = '' }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState<FeedbackFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ''
  });

  // Load feedback data
  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getAllFeedbackAdmin(filters);
      setFeedback(response.feedback);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading feedback:', error);
      showNotification('Error loading feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await feedbackService.getFeedbackStatsAdmin();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on mount and filter changes
  useEffect(() => {
    loadFeedback();
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof FeedbackFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
    setSelectedFeedback([]); // Clear selection
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle individual feedback moderation
  const handleModerate = async (feedbackId: string, isApproved: boolean, isHidden: boolean) => {
    try {
      const data: ModerateFeedbackData = { isApproved, isHidden };
      await feedbackService.moderateFeedback(feedbackId, data);
      showNotification('Feedback moderated successfully', 'success');
      loadFeedback();
      loadStats();
    } catch (error) {
      console.error('Error moderating feedback:', error);
      showNotification('Error moderating feedback', 'error');
    }
  };

  // Handle bulk moderation
  const handleBulkModerate = async (isApproved: boolean, isHidden: boolean) => {
    if (selectedFeedback.length === 0) {
      showNotification('Please select feedback to moderate', 'warning');
      return;
    }

    try {
      const data: BulkModerateFeedbackData = {
        feedbackIds: selectedFeedback,
        isApproved,
        isHidden
      };
      const response = await feedbackService.bulkModerateFeedback(data);
      showNotification(response.message, 'success');
      setSelectedFeedback([]);
      loadFeedback();
      loadStats();
    } catch (error) {
      console.error('Error bulk moderating feedback:', error);
      showNotification('Error bulk moderating feedback', 'error');
    }
  };

  // Handle feedback deletion
  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await feedbackService.deleteFeedbackAdmin(feedbackId);
      showNotification('Feedback deleted successfully', 'success');
      loadFeedback();
      loadStats();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification('Error deleting feedback', 'error');
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedFeedback.length === 0) {
      showNotification('Please select feedback to delete', 'warning');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedFeedback.length} feedback items?`)) return;

    try {
      for (const feedbackId of selectedFeedback) {
        await feedbackService.deleteFeedbackAdmin(feedbackId);
      }
      showNotification(`${selectedFeedback.length} feedback items deleted successfully`, 'success');
      setSelectedFeedback([]);
      loadFeedback();
      loadStats();
    } catch (error) {
      console.error('Error bulk deleting feedback:', error);
      showNotification('Error bulk deleting feedback', 'error');
    }
  };

  // Handle feedback editing
  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback.id);
    setEditForm({
      rating: feedback.rating,
      comment: feedback.comment
    });
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!editingFeedback) return;

    try {
      await feedbackService.updateFeedbackAdmin(editingFeedback, editForm);
      showNotification('Feedback updated successfully', 'success');
      setEditingFeedback(null);
      loadFeedback();
      loadStats();
    } catch (error) {
      console.error('Error updating feedback:', error);
      showNotification('Error updating feedback', 'error');
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedFeedback.length === feedback.length) {
      setSelectedFeedback([]);
    } else {
      setSelectedFeedback(feedback.map(f => f.id));
    }
  };

  const handleSelectFeedback = (feedbackId: string) => {
    setSelectedFeedback(prev => 
      prev.includes(feedbackId) 
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Get status badge
  const getStatusBadge = (feedback: Feedback) => {
    if (feedback.is_hidden) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <EyeOff size={12} className="mr-1" />
          Hidden
        </span>
      );
    }
    if (feedback.is_approved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle size={12} className="mr-1" />
        Pending
      </span>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feedback Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and moderate customer feedback
            </p>
          </div>
          <button
            onClick={() => { loadFeedback(); loadStats(); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFeedback}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <MessageSquare size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approvedFeedback}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <CheckCircle size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingFeedback}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500 text-white">
                <AlertCircle size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <Star size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Star size={16} className="text-gray-500" />
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Ratings</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFeedback.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFeedback.length} selected
              </span>
              <button
                onClick={() => handleBulkModerate(true, false)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkModerate(false, true)}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Hide All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Feedback ({pagination.total})
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFeedback.length === feedback.length && feedback.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Select All</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No feedback found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {feedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedFeedback.includes(item.id)}
                    onChange={() => handleSelectFeedback(item.id)}
                    className="mt-1 rounded border-gray-300 dark:border-gray-600"
                  />

                  {/* Feedback Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(item.rating)}
                          </div>
                          {getStatusBadge(item)}
                        </div>

                        {editingFeedback === item.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rating
                              </label>
                              <select
                                value={editForm.rating}
                                onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              >
                                <option value={1}>1 Star</option>
                                <option value={2}>2 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={5}>5 Stars</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Comment
                              </label>
                              <textarea
                                value={editForm.comment}
                                onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={handleEditSubmit}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingFeedback(null)}
                                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-900 dark:text-white mb-2">{item.comment}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>
                                {item.users?.name || 'Anonymous'} • {item.users?.email}
                              </span>
                              <span>
                                {item.portfolio_projects?.title && `Project: ${item.portfolio_projects.title}`}
                              </span>
                              <span>
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {editingFeedback !== item.id && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleModerate(item.id, !item.is_approved, item.is_hidden)}
                            className={`p-2 transition-colors ${
                              item.is_approved 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-yellow-600 hover:text-yellow-700'
                            }`}
                            title={item.is_approved ? 'Unapprove' : 'Approve'}
                          >
                            {item.is_approved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleModerate(item.id, item.is_approved, !item.is_hidden)}
                            className={`p-2 transition-colors ${
                              item.is_hidden 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                            title={item.is_hidden ? 'Show' : 'Hide'}
                          >
                            {item.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManager; 