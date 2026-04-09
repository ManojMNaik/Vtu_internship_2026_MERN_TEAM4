import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasRoutePermission, getDashboardPath } from "@/config/rbac";

/**
 * ProtectedRoute Component
 * Handles authentication and role-based access control
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Roles allowed to access this route
 * @param {string} props.redirectTo - Custom redirect path for unauthorized users
 * @param {React.ReactNode} props.children - Child components
 */
export default function ProtectedRoute({
  allowedRoles = [],
  redirectTo,
  children,
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Memoize user role to prevent unnecessary recalculations
  const userRole = useMemo(() => user?.role || null, [user?.role]);

  // Memoize permission check
  const hasPermission = useMemo(() => {
    return hasRoutePermission(userRole, allowedRoles);
  }, [userRole, allowedRoles]);

  // Show minimal loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const returnPath = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: returnPath }}
      />
    );
  }

  // Check role-based permission
  if (allowedRoles.length > 0 && !hasPermission) {
    // Redirect to unauthorized page or custom redirect
    const unauthorizedRedirect = redirectTo || "/unauthorized";
    return (
      <Navigate
        to={unauthorizedRedirect}
        replace
        state={{ 
          from: location.pathname,
          requiredRoles: allowedRoles,
          userRole: userRole,
        }}
      />
    );
  }

  return children || <Outlet />;
}

/**
 * PublicRoute Component
 * For routes that should only be accessible when NOT logged in
 * (e.g., login, signup pages)
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return children || <Outlet />;
}
