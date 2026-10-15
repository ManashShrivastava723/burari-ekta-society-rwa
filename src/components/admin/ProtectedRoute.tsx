import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole = 'staff' }: ProtectedRouteProps) {
  const { profile, loading, isAuthorized, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
          <p className="text-sm">Checking authorization…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!profile) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated but not authorized for this role
  if (!isAuthorized(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-sm">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 text-sm mb-4">
            You do not have the required permissions to access this page.
            Please contact the Super Admin if you believe this is an error.
          </p>
          {isDemoMode && (
            <p className="text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">
              Demo mode: sign in as demo@admin.com / demo1234
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
