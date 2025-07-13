import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Camera,
  BarChart3,
  FolderOpen,
  Folder,
  Image,
  MessageSquare,
  Mail,
  Instagram,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  LayoutGrid,
  Upload,
  Home,
  MessageCircle,
  Instagram as InstagramIcon,
  ListChecks,
  BarChart4,
  Info,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
// import logoImage from '../../Assets/logo/IMG_0040.JPG';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: BarChart4 },
    { label: 'Portfolio Manager', path: '/admin/portfolio-manager', icon: LayoutGrid },
    { label: 'Projects', path: '/admin/projects', icon: Folder },
    { label: 'Packages', path: '/admin/packages', icon: Info },
    { label: 'Upload Project', path: '/admin/projects/new', icon: Upload },
    { label: 'Homepage Elements', path: '/admin/homepage', icon: Home },
    { label: 'About Section', path: '/admin/about-section', icon: Info },
    { label: 'Team', path: '/admin/team', icon: Users },
    { label: 'Feedback', path: '/admin/feedback', icon: MessageCircle },
    { label: 'Contacts', path: '/admin/contacts', icon: ListChecks },
    { label: 'Instagram', path: '/admin/instagram', icon: InstagramIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-40"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout; 