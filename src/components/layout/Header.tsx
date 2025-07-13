import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import logoImage from '../../Assets/logo/IMG_0040.JPG';

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
    { label: 'Reviews', path: '/reviews' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `bg-white shadow-md dark:bg-gray-900 ${
              isMobileMenuOpen ? 'h-screen lg:h-auto' : ''
            }`
          : 'bg-white/90 backdrop-blur-sm dark:bg-gray-900/90'
      }`}
    >
      <div className="w-full px-0 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 ml-2 sm:ml-4 lg:ml-6">
            <img 
              src={logoImage} 
              alt="Manish Photography Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span 
                className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                  isScrolled || mode === 'dark' ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="hidden sm:inline">Manish Photography</span>
                <span className="sm:hidden">MP</span>
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic hidden sm:block">
                Capturing the moments is good; living those moments is the best.
              </span>
            </div>
          </Link>

          {/* Centered Navigation - Hidden on mobile, visible on tablet and desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-medium transition-colors text-sm xl:text-base ${
                    isScrolled || mode === 'dark' 
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white' 
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
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
          </div>

          {/* Right side - Theme toggle and Auth - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 mr-2 sm:mr-4 lg:mr-6">
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 transition-colors ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
              }`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 xl:space-x-4">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`font-medium transition-colors text-sm xl:text-base ${
                      isScrolled || mode === 'dark'
                        ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-2 xl:px-4 xl:py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm xl:text-base"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 xl:space-x-3">
                <Link
                  to="/login"
                  className={`font-medium transition-colors text-sm xl:text-base ${
                    isScrolled || mode === 'dark'
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <span
                  className={`${
                    isScrolled || mode === 'dark' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  /
                </span>
                <Link
                  to="/register"
                  className={`font-medium transition-colors text-sm xl:text-base ${
                    isScrolled || mode === 'dark'
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-2 mr-2 sm:mr-4 lg:mr-6">
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 transition-colors ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
              }`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 px-4 py-6 border-t border-gray-200 dark:border-gray-700"
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors text-base ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-base"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors w-full text-left text-base"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-base"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-base"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;