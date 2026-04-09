import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ROLES,
  hasRoutePermission,
  getDashboardPath,
  getRoutePermission,
  getNavItemsForRole,
} from "@/config/rbac";

/**
 * Custom hook for role-based access control
 * Provides utilities for checking permissions and navigating based on role
 * 
 * @returns {Object} RBAC utilities
 */
export function useRBAC() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Current user role
  const role = useMemo(() => {
    if (!isAuthenticated) return ROLES.GUEST;
    return user?.role || null;
  }, [isAuthenticated, user?.role]);

  // Check if user has a specific role
  const hasRole = useCallback(
    (requiredRole) => {
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
      }
      return role === requiredRole;
    },
    [role]
  );

  // Check if user can access a route
  const canAccess = useCallback(
    (allowedRoles) => {
      if (!role) return false;
      if (!isAuthenticated && allowedRoles.length > 0) return false;
      return hasRoutePermission(role, allowedRoles);
    },
    [isAuthenticated, role]
  );

  // Check if user can access a specific path
  const canAccessPath = useCallback(
    (path) => {
      const permission = getRoutePermission(path);
      if (!permission) return true; // Unknown routes are accessible
      if (permission.requireAuth && !isAuthenticated) return false;
      if (!role && permission.requireAuth) return false;
      return hasRoutePermission(role, permission.roles);
    },
    [isAuthenticated, role]
  );

  // Get dashboard path for current user
  const dashboardPath = useMemo(() => getDashboardPath(role), [role]);

  // Get nav items for current user
  const navItems = useMemo(
    () => getNavItemsForRole(role, isAuthenticated),
    [role, isAuthenticated]
  );

  // Navigate to dashboard
  const goToDashboard = useCallback(() => {
    navigate(dashboardPath);
  }, [navigate, dashboardPath]);

  // Navigate with permission check
  const navigateIfAllowed = useCallback(
    (path, allowedRoles = []) => {
      if (canAccess(allowedRoles)) {
        navigate(path);
        return true;
      }
      navigate("/unauthorized", { state: { from: path, requiredRoles: allowedRoles } });
      return false;
    },
    [canAccess, navigate]
  );

  // Role check helpers
  const isGuest = useMemo(() => role === ROLES.GUEST, [role]);
  const isUser = useMemo(() => role === ROLES.USER, [role]);
  const isTechnician = useMemo(() => role === ROLES.TECHNICIAN, [role]);
  const isAdmin = useMemo(() => role === ROLES.ADMIN, [role]);

  return {
    // State
    role,
    loading,
    isAuthenticated,
    
    // Role checks
    isGuest,
    isUser,
    isTechnician,
    isAdmin,
    hasRole,
    
    // Permission checks
    canAccess,
    canAccessPath,
    
    // Navigation
    dashboardPath,
    navItems,
    goToDashboard,
    navigateIfAllowed,
    
    // Constants
    ROLES,
  };
}

export default useRBAC;
