import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/ui/Loader';

/**
 * AdminProtectedRoute — wraps admin pages.
 * Redirects to /login if not authenticated, or /dashboard if not admin.
 */
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080000' }}>
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  console.log("[AdminRoute] Route guard check - current user role:", currentUser.role);

  if (currentUser.role !== 'admin') {
    console.log("[AdminRoute] User is not admin, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
