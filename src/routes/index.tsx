import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Portfolio = lazy(() => import('../pages/Portfolio'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const CostEstimator = lazy(() => import('../pages/CostEstimator'));
const Offers = lazy(() => import('../pages/Offers'));
const Blog = lazy(() => import('../pages/Blog'));
const Reviews = lazy(() => import('../pages/Reviews'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Admin = lazy(() => import('../pages/Admin'));

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
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/cost-estimator" element={<MainLayout><CostEstimator /></MainLayout>} />
          <Route path="/offers" element={<MainLayout><Offers /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
          <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;