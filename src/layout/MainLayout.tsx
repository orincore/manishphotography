import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { mode } = useThemeStore();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
  }, [mode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;