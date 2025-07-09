import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminProtectedRoute from '../components/admin/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Portfolio = lazy(() => import('../pages/Portfolio'));
const PortfolioNew = lazy(() => import('../pages/PortfolioNew'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const CostEstimator = lazy(() => import('../pages/CostEstimator'));
const Offers = lazy(() => import('../pages/Offers'));
const Reviews = lazy(() => import('../pages/Reviews'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

// Admin pages
const AdminLogin = lazy(() => import('../components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const TestDashboard = lazy(() => import('../components/admin/TestDashboard'));
const SimpleDashboard = lazy(() => import('../components/admin/SimpleDashboard'));
const SimpleAdminDashboard = lazy(() => import('../components/admin/SimpleAdminDashboard'));
const CategoriesList = lazy(() => import('../pages/admin/CategoriesList'));
const ProjectUpload = lazy(() => import('../pages/admin/ProjectUpload'));
const ProjectsList = lazy(() => import('../pages/admin/ProjectsList'));
const EditProject = lazy(() => import('../pages/admin/EditProject'));
const HomepageElementsManager = lazy(() => import('../components/admin/HomepageElementsManager'));
const ProgressTrackingDemo = lazy(() => import('../components/debug/ProgressTrackingDemo'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
          <Route path="/portfolio/:categorySlug" element={<MainLayout><CategoryPage /></MainLayout>} />
          <Route path="/portfolio/:categorySlug/:subcategorySlug" element={<MainLayout><PortfolioNew /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/cost-estimator" element={<MainLayout><CostEstimator /></MainLayout>} />
          <Route path="/offers" element={<MainLayout><Offers /></MainLayout>} />
          <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ErrorBoundary>
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              </ErrorBoundary>
            } 
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="simple" element={<SimpleDashboard />} />
            <Route path="simple-admin" element={<SimpleAdminDashboard />} />
            <Route path="test" element={<TestDashboard />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectUpload />} />
            <Route path="projects/edit/:projectId" element={<EditProject />} />
            <Route path="homepage" element={<HomepageElementsManager />} />
            <Route path="progress-demo" element={<ProgressTrackingDemo />} />
            {/* Add more admin routes here as we create them */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;