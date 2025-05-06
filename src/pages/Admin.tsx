import { useEffect, useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import DashboardChart from '../components/admin/DashboardChart';
import UserList from '../components/admin/UserList';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <DashboardChart />
    </div>
  );
};

const AdminUsers = () => {
  return <UserList />;
};

const AdminPortfolio = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Portfolio Management
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This section is under development. Soon you'll be able to manage your portfolio items here.
      </p>
    </div>
  );
};

const AdminOffers = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Offers Management
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This section is under development. Soon you'll be able to manage your special offers here.
      </p>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Admin Settings
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This section is under development. Soon you'll be able to manage your admin settings here.
      </p>
    </div>
  );
};

const Admin = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Update page title
    document.title = 'Admin - Manish Photography';
  }, []);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/admin' || path === '/admin/') return 'Dashboard';
    if (path === '/admin/users') return 'User Management';
    if (path === '/admin/portfolio') return 'Portfolio Management';
    if (path === '/admin/offers') return 'Offers Management';
    if (path === '/admin/settings') return 'Settings';
    
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <AdminNavbar />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title={getPageTitle()} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen}
          />
          
          <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/portfolio" element={<AdminPortfolio />} />
              <Route path="/offers" element={<AdminOffers />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;