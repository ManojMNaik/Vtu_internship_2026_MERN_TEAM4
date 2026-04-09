import { useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath, ROLES } from "@/config/rbac";

/**
 * UnauthorizedPage Component
 * Displayed when a user tries to access a route they don't have permission for
 */
export default function UnauthorizedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Get info from location state
  const { from, requiredRoles, userRole: stateUserRole } = location.state || {};
  const currentRole = user?.role || stateUserRole || "unknown";

  // Get appropriate redirect path
  const dashboardPath = useMemo(() => {
    if (!isAuthenticated) return "/login";
    return getDashboardPath(user?.role);
  }, [isAuthenticated, user?.role]);

  // Format role name for display
  const formatRole = useCallback((role) => {
    if (!role) return "Unknown";
    return role.charAt(0).toUpperCase() + role.slice(1);
  }, []);

  // Handle go back
  const handleGoBack = useCallback(() => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(dashboardPath);
    }
  }, [navigate, dashboardPath]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout(navigate);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
        >
          <ShieldX className="w-10 h-10 text-red-500" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        
        {/* Description */}
        <p className="text-slate-600 mb-6">
          {isAuthenticated ? (
            <>
              You don't have permission to access this page.
              {from && (
                <span className="block mt-2 text-sm text-slate-500">
                  Attempted to access: <code className="bg-slate-200 px-1 rounded">{from}</code>
                </span>
              )}
            </>
          ) : (
            "Please log in to access this page."
          )}
        </p>

        {/* Role info */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div>
                <span className="text-slate-500">Your role:</span>
                <span className="ml-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {formatRole(currentRole)}
                </span>
              </div>
              {requiredRoles && requiredRoles.length > 0 && (
                <div>
                  <span className="text-slate-500">Required:</span>
                  <span className="ml-1 font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {requiredRoles.map(formatRole).join(" or ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link to={dashboardPath}>
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/login" state={{ from }}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Switch account hint */}
        {isAuthenticated && (
          <p className="mt-6 text-sm text-slate-500">
            Wrong account?{" "}
            <button
              onClick={handleLogout}
              className="text-primary hover:underline font-medium"
            >
              Log out and switch
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
