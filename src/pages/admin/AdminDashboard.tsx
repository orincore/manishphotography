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
  Edit
} from 'lucide-react';
import DashboardStats from '../../components/admin/DashboardStats';
import DashboardChart from '../../components/admin/DashboardChart';
import adminService, { DashboardStats as DashboardStatsType } from '../../services/adminService';

// Remove the local interface since we're importing it from adminService

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStatsType>({
    totalCategories: 0,
    totalSubcategories: 0,
    totalProjects: 0,
    totalFeedback: 0,
    totalContacts: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard mounted');
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard stats...');
      
      // Fetch real data from API
      const dashboardStats = await adminService.getDashboardStats();
      
      // Validate that we got proper data (not HTML)
      if (typeof dashboardStats === 'object' && dashboardStats !== null) {
        setStats(dashboardStats);
        console.log('Dashboard stats loaded:', dashboardStats);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set default values on error
      setStats({
        totalCategories: 0,
        totalSubcategories: 0,
        totalProjects: 0,
        totalFeedback: 0,
        totalContacts: 0,
        totalViews: 0
      });
    } finally {
      setLoading(false);
    }
  };

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

  console.log('AdminDashboard rendering, loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardStats
          title="Total Categories"
          value={stats.totalCategories}
          icon={FolderOpen}
          color="blue"
          change="+2"
          changeType="positive"
        />
        <DashboardStats
          title="Total Subcategories"
          value={stats.totalSubcategories}
          icon={Folder}
          color="green"
          change="+5"
          changeType="positive"
        />
        <DashboardStats
          title="Total Projects"
          value={stats.totalProjects}
          icon={Image}
          color="purple"
          change="+12"
          changeType="positive"
        />
        <DashboardStats
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="orange"
          change="+89"
          changeType="positive"
        />
        <DashboardStats
          title="Feedback"
          value={stats.totalFeedback}
          icon={MessageSquare}
          color="indigo"
          change="+3"
          changeType="positive"
        />
        <DashboardStats
          title="Contacts"
          value={stats.totalContacts}
          icon={Mail}
          color="pink"
          change="+1"
          changeType="positive"
        />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Analytics Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Views
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Last 7 days
            </p>
          </div>
          <div className="p-6">
            <DashboardChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 