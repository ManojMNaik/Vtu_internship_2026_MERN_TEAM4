/**
 * Role-Based Access Control (RBAC) Configuration
 * Central configuration for route permissions and role definitions
 */

// Available roles in the system
export const ROLES = {
  GUEST: "guest",
  USER: "user",
  TECHNICIAN: "technician",
  ADMIN: "admin",
};

// Role hierarchy (higher roles inherit lower role permissions if needed)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.TECHNICIAN]: 2,
  [ROLES.USER]: 1,
  [ROLES.GUEST]: 0,
};

/**
 * Route permissions configuration
 * Define which roles can access which routes
 * 
 * Format:
 * - path: Route path pattern (supports wildcards with *)
 * - roles: Array of allowed roles (empty = public, ['*'] = any authenticated)
 * - requireAuth: Whether authentication is required
 * - redirectTo: Custom redirect path if unauthorized (optional)
 */
export const ROUTE_PERMISSIONS = {
  // Public routes (no auth required)
  "/": { roles: [], requireAuth: false },
  "/login": { roles: [], requireAuth: false },
  "/signup": { roles: [], requireAuth: false },
  "/forgot-password": { roles: [], requireAuth: false },
  "/reset-password": { roles: [], requireAuth: false },
  "/verify-otp": { roles: [], requireAuth: false },

  // Authenticated routes (any logged-in user)
  "/dashboard": { roles: ["*"], requireAuth: true },
  "/profile": { roles: ["*"], requireAuth: true },
  "/complete-profile": { roles: ["*"], requireAuth: true },

  // User-only routes
  "/technicians": { roles: [ROLES.USER], requireAuth: true },
  "/technician/:id": { roles: [ROLES.USER], requireAuth: true },
  "/user/dashboard": { roles: [ROLES.USER], requireAuth: true },
  "/bookings": { roles: [ROLES.USER], requireAuth: true },
  "/bookings/new": { roles: [ROLES.USER], requireAuth: true },

  // Technician-only routes
  "/technician": { roles: [ROLES.TECHNICIAN], requireAuth: true },
  "/technician/dashboard": { roles: [ROLES.TECHNICIAN], requireAuth: true },
  "/technician/bookings": { roles: [ROLES.TECHNICIAN], requireAuth: true },
  "/technician/services": { roles: [ROLES.TECHNICIAN], requireAuth: true },
  "/technician/portfolio": { roles: [ROLES.TECHNICIAN], requireAuth: true },

  // Admin-only routes
  "/admin/dashboard": { roles: [ROLES.ADMIN], requireAuth: true },
  "/admin/*": { roles: [ROLES.ADMIN], requireAuth: true },
};

/**
 * Navigation items configuration per role
 * Used by Navbar and other navigation components
 */
export const NAV_ITEMS = {
  [ROLES.GUEST]: [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Login", path: "/login", icon: "LogIn" },
    { label: "Get Started", path: "/signup", icon: "UserPlus", variant: "accent" },
  ],
  [ROLES.USER]: [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Browse Services", path: "/technicians", icon: "Search" },
    { label: "My Bookings", path: "/bookings", icon: "Calendar" },
    { label: "Profile", path: "/profile", icon: "User" },
  ],
  [ROLES.TECHNICIAN]: [
    { label: "Workspace", path: "/technician", icon: "Briefcase" },
    { label: "Bookings", path: "/technician/bookings", icon: "Calendar" },
    { label: "Services", path: "/technician/services", icon: "Wrench" },
    { label: "Portfolio", path: "/technician/portfolio", icon: "Image" },
    { label: "Profile", path: "/profile", icon: "User" },
  ],
  [ROLES.ADMIN]: [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Profile", path: "/profile", icon: "User" },
  ],
};

/**
 * Dashboard redirect paths based on role
 */
export const DASHBOARD_REDIRECTS = {
  [ROLES.USER]: "/user/dashboard",
  [ROLES.TECHNICIAN]: "/technician",
  [ROLES.ADMIN]: "/admin/dashboard",
};

/**
 * Check if a role has permission to access a route
 * @param {string} userRole - The user's role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export function hasRoutePermission(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (allowedRoles.includes("*")) return true;
  return allowedRoles.includes(userRole);
}

/**
 * Get the appropriate dashboard path for a role
 * @param {string} role - The user's role
 * @returns {string}
 */
export function getDashboardPath(role) {
  return DASHBOARD_REDIRECTS[role] || "/dashboard";
}

/**
 * Get navigation items for a specific role
 * @param {string} role - The user's role
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {Array}
 */
export function getNavItemsForRole(role, isAuthenticated) {
  if (!isAuthenticated) return NAV_ITEMS[ROLES.GUEST];
  return NAV_ITEMS[role] || NAV_ITEMS[ROLES.USER];
}

/**
 * Check if a path matches a route pattern
 * @param {string} path - The actual path
 * @param {string} pattern - The route pattern (supports :param and *)
 * @returns {boolean}
 */
export function matchRoutePath(path, pattern) {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:[^/]+/g, "[^/]+") // Replace :param with regex
    .replace(/\*/g, ".*"); // Replace * with wildcard
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * Get route permission for a specific path
 * @param {string} path - The path to check
 * @returns {Object|null}
 */
export function getRoutePermission(path) {
  // Direct match first
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path];
  }

  // Pattern matching
  for (const [pattern, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (matchRoutePath(path, pattern)) {
      return permission;
    }
  }

  return null;
}
