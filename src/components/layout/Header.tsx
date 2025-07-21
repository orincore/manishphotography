import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = (path: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300); // Match exit animation duration
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      logout();
    }, 300);
  };

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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 shrink-0">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1 max-w-4xl mx-4">
            <nav className="flex items-center justify-center">
              <ul className="flex flex-wrap items-center justify-center gap-1 xl:gap-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`relative px-2 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
                        isScrolled || mode === 'dark' 
                          ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white' 
                          : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                      } ${location.pathname === item.path ? 'font-semibold' : ''}`}
                    >
                      {item.label}
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right side - Theme toggle and Auth */}
          <div className="hidden lg:flex items-center space-x-4 shrink-0">
            <button
              onClick={toggleTheme}
              className={`rounded-full p-2 transition-colors shrink-0 ${
                isScrolled || mode === 'dark'
                  ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
              }`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 shrink-0">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/projects"
                    className={`font-medium transition-colors text-sm whitespace-nowrap ${
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
                  className="px-3 py-1.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 shrink-0">
                <Link
                  to="/login"
                  className={`font-medium transition-colors text-sm whitespace-nowrap ${
                    isScrolled || mode === 'dark'
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  to="/register"
                  className={`font-medium transition-colors text-sm whitespace-nowrap ${
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
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
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleMobileLinkClick(item.path)}
                    className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors text-base ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleMobileLinkClick('/admin/projects')}
                          className="w-full text-left py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-base"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-base mt-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMobileLinkClick('/login')}
                        className="w-full text-left py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-base"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleMobileLinkClick('/register')}
                        className="w-full text-left py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-base mt-2"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;