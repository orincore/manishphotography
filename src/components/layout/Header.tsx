import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Offers', path: '/offers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
    { label: 'Estimate', path: '/cost-estimator' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `bg-white shadow-md dark:bg-gray-900 ${
              isMobileMenuOpen ? 'h-screen md:h-auto' : ''
            }`
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className={`h-8 w-8 ${isScrolled || mode === 'dark' ? 'text-blue-600' : 'text-white'}`} />
            <span 
              className={`text-xl font-bold ${
                isScrolled || mode === 'dark' ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}
            >
              Manish Photography
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-medium transition-colors ${
                    isScrolled || mode === 'dark' 
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white' 
                      : 'text-white hover:text-blue-200'
                  } ${location.pathname === item.path ? 'font-semibold' : ''}`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2 transition-colors ${
                  isScrolled || mode === 'dark'
                    ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                    : 'text-white hover:text-blue-200'
                }`}
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/admin"
                    className={`font-medium transition-colors ${
                      isScrolled || mode === 'dark'
                        ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className={`font-medium transition-colors ${
                      isScrolled || mode === 'dark'
                        ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    Login
                  </Link>
                  <span
                    className={`${
                      isScrolled || mode === 'dark' ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                    }`}
                  >
                    /
                  </span>
                  <Link
                    to="/register"
                    className={`font-medium transition-colors ${
                      isScrolled || mode === 'dark'
                        ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 transition-colors ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 px-4 py-5"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 rounded-md font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="py-2 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={logout}
                    className="py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;