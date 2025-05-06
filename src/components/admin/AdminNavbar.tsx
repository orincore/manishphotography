import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Image, 
  Tag, 
  BarChart4,
  Settings
} from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <BarChart4 size={20} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Portfolio', path: '/admin/portfolio', icon: <Image size={20} /> },
    { label: 'Offers', path: '/admin/offers', icon: <Tag size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="bg-gray-800 text-gray-200 h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <span className="font-bold text-xl text-white">Admin Panel</span>
        </Link>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminNavbar;