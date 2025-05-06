import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Update page title
    document.title = 'Login - Manish Photography';
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;