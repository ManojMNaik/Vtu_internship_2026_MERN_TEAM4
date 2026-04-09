import { useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath, ROLES } from "@/config/rbac";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Memoize user role
  const userRole = useMemo(() => user?.role || ROLES.GUEST, [user?.role]);

  // Memoize dashboard path based on role
  const dashboardPath = useMemo(() => getDashboardPath(userRole), [userRole]);

  // Memoize dashboard label
  const dashboardLabel = useMemo(() => {
    if (userRole === ROLES.TECHNICIAN) return "Workspace";
    return "Dashboard";
  }, [userRole]);

  const onLogout = useCallback(() => {
    logout(navigate);
  }, [logout, navigate]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const navButtonClass = useCallback(
    (path) => (isActive(path) ? "border-primary bg-primary/10 text-primary hover:bg-primary/15" : ""),
    [isActive]
  );

  // Memoized nav items based on role
  const navItems = useMemo(() => {
    if (!isAuthenticated) return [];

    const items = [];

    // Home - accessible to users and admins
    if (userRole !== ROLES.TECHNICIAN) {
      items.push({ path: "/", label: "Home" });
    }

    // Dashboard/Workspace - all authenticated
    items.push({ path: dashboardPath, label: dashboardLabel });

    // User-specific items
    if (userRole === ROLES.USER) {
      items.push({ path: "/technicians", label: "Browse Services" });
      items.push({ path: "/bookings", label: "My Bookings" });
    }

    // Technician-specific items
    if (userRole === ROLES.TECHNICIAN) {
      items.push({ path: "/technician/bookings", label: "Bookings" });
      items.push({ path: "/technician/services", label: "Services" });
      items.push({ path: "/technician/portfolio", label: "Portfolio" });
    }

    // Profile - all authenticated
    items.push({ path: "/profile", label: "Profile" });

    return items;
  }, [isAuthenticated, userRole, dashboardPath, dashboardLabel]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2" to="/">
          <img className="h-8 w-auto" src={logo} alt="ServiceMate logo" />
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant="outline"
                size="sm"
                className={navButtonClass(item.path)}
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}

            {/* User avatar */}
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {(user?.fullName || "U").trim().charAt(0).toUpperCase()}
              </div>
              <span className="max-w-24 truncate text-sm text-slate-700">{user?.fullName || "User"}</span>
            </div>

            <Button variant="accent" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
