import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FolderOpen, 
  Folder, 
  Image, 
  MessageSquare, 
  Mail, 
  Instagram,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  RefreshCw,
  Users
} from 'lucide-react';
import feedbackService, { FeedbackStats } from '../../services/feedbackService';
import contactService, { ContactStats } from '../../services/contactService';
import teamService, { TeamStats } from '../../services/teamService';
import { showNotification } from '../../utils/notifications';

const SimpleAdminDashboard = () => {
  const [stats, setStats] = useState<{
    feedback: FeedbackStats | null;
    contacts: ContactStats | null;
    team: TeamStats | null;
  }>({
    feedback: null,
    contacts: null,
    team: null
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [feedbackResponse, contactResponse, teamResponse] = await Promise.all([
        feedbackService.getFeedbackStatsAdmin().catch(() => null),
        contactService.getContactStats().catch(() => null),
        teamService.getTeamStats().catch(() => null)
      ]);
      
      setStats({
        feedback: feedbackResponse?.stats || null,
        contacts: contactResponse?.stats || null,
        team: teamResponse || null
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      showNotification('Error loading dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const quickActions = [
    {
      title: 'Add Category',
      description: 'Create a new portfolio category',
      icon: FolderOpen,
      path: '/admin/categories/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Subcategory',
      description: 'Create a new subcategory',
      icon: Folder,
      path: '/admin/subcategories/new',
      color: 'bg-green-500'
    },
    {
      title: 'Upload Project',
      description: 'Add a new project to portfolio',
      icon: Image,
      path: '/admin/projects/new',
      color: 'bg-purple-500'
    },
    {
      title: 'View Feedback',
      description: 'Check customer feedback',
      icon: MessageSquare,
      path: '/admin/feedback',
      color: 'bg-orange-500'
    },
    {
      title: 'View Contacts',
      description: 'Manage contact submissions',
      icon: Mail,
      path: '/admin/contacts',
      color: 'bg-pink-500'
    },
    {
      title: 'Homepage Elements',
      description: 'Manage homepage content',
      icon: BarChart3,
      path: '/admin/homepage',
      color: 'bg-indigo-500'
    },
    {
      title: 'Team Management',
      description: 'Manage team members',
      icon: Users,
      path: '/admin/team',
      color: 'bg-teal-500'
    }
  ];

  const recentActivities = [
    {
      type: 'project',
      title: 'New project uploaded',
      description: 'Wedding photos added to Sarah & John collection',
      time: '2 hours ago'
    },
    {
      type: 'category',
      title: 'Category updated',
      description: 'Maternity category description updated',
      time: '4 hours ago'
    },
    {
      type: 'feedback',
      title: 'New feedback received',
      description: '5-star review from wedding client',
      time: '1 day ago'
    },
    {
      type: 'contact',
      title: 'New contact form submission',
      description: 'Inquiry about wedding photography services',
      time: '2 days ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid - Dynamic Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : '5'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +2
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <FolderOpen size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Subcategories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : '12'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +5
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-500 text-white">
              <Folder size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : '48'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +12
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500 text-white">
              <Image size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : '1,234'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +89
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-500 text-white">
              <Eye size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Feedback
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : (stats.feedback?.totalFeedback || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stats.feedback?.averageRating ? `${stats.feedback.averageRating.toFixed(1)} avg` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500 text-white">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Contacts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : (stats.contacts?.totalContacts || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-red-600 dark:text-red-400 mr-1" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {stats.contacts?.unreadContacts ? `${stats.contacts.unreadContacts} unread` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-pink-500 text-white">
              <Mail size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Team Members
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : (stats.team?.totalMembers || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stats.team?.activeMembers ? `${stats.team.activeMembers} active` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-teal-500 text-white">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Common tasks to manage your portfolio
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={action.path}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard; 