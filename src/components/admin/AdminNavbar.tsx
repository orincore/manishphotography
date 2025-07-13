import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Image, 
  Tag, 
  BarChart4,
  Settings,
  LayoutGrid,
  Upload,
  Home,
  MessageCircle,
  Instagram as InstagramIcon,
  ListChecks,
  FilePlus,
  Folder,
  Info,
  Package as PackageIcon,
} from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <BarChart4 size={20} /> },
    { label: 'Portfolio Manager', path: '/admin/portfolio-manager', icon: <LayoutGrid size={20} /> },
    { label: 'Projects', path: '/admin/projects', icon: <Folder size={20} /> },
    { label: 'Packages', path: '/admin/packages', icon: <PackageIcon size={20} /> },
    { label: 'Upload Project', path: '/admin/projects/new', icon: <Upload size={20} /> },
    { label: 'Homepage Elements', path: '/admin/homepage', icon: <Home size={20} /> },
    { label: 'About Section', path: '/admin/about-section', icon: <Info size={20} /> },
    { label: 'Team', path: '/admin/team', icon: <Users size={20} /> },
    { label: 'Feedback', path: '/admin/feedback', icon: <MessageCircle size={20} /> },
    { label: 'Contacts', path: '/admin/contacts', icon: <ListChecks size={20} /> },
    { label: 'Instagram', path: '/admin/instagram', icon: <InstagramIcon size={20} /> },
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