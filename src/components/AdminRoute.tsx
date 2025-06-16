
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const { data: role, isLoading, error } = useUserRole();

  console.log('AdminRoute - user:', user?.email, 'role:', role, 'loading:', loading, 'isLoading:', isLoading);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (error) {
    console.error('Error fetching user role:', error);
    return <Navigate to="/" replace />;
  }

  if (role !== 'admin') {
    console.log('User role is not admin:', role, 'redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted, rendering children');
  return <>{children}</>;
};
