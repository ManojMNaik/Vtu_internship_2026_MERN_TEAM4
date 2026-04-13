import { useMemo, useCallback, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath, ROLES } from "@/config/rbac";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const userRole = useMemo(() => user?.role || ROLES.GUEST, [user?.role]);
  const dashboardPath = useMemo(() => getDashboardPath(userRole), [userRole]);

  const dashboardLabel = useMemo(() => {
    if (userRole === ROLES.TECHNICIAN) return "Workspace";
    return "Dashboard";
  }, [userRole]);

  const onLogout = useCallback(() => {
    setMobileOpen(false);
    logout(navigate);
  }, [logout, navigate]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const navButtonClass = useCallback(
    (path) => (isActive(path) ? "border-primary bg-primary/10 text-primary hover:bg-primary/15" : ""),
    [isActive]
  );

  const navItems = useMemo(() => {
    if (!isAuthenticated) return [];

    const items = [];

    if (userRole !== ROLES.TECHNICIAN) {
      items.push({ path: "/", label: "Home" });
    }

    items.push({ path: dashboardPath, label: dashboardLabel });

    if (userRole === ROLES.USER) {
      items.push({ path: "/technicians", label: "Browse Services" });
      items.push({ path: "/bookings", label: "My Bookings" });
    }

    if (userRole === ROLES.TECHNICIAN) {
      items.push({ path: "/technician/bookings", label: "Bookings" });
      items.push({ path: "/technician/services", label: "Services" });
      items.push({ path: "/technician/portfolio", label: "Portfolio" });
    }

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
          <>
            {/* Desktop nav */}
            <div className="hidden items-center gap-2 md:flex md:gap-3">
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

              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 lg:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {(user?.fullName || "U").trim().charAt(0).toUpperCase()}
                </div>
                <span className="max-w-24 truncate text-sm text-slate-700">{user?.fullName || "User"}</span>
              </div>

              <Button variant="accent" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
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

      {/* Mobile drawer */}
      {isAuthenticated && mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex items-center gap-3 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {(user?.fullName || "U").trim().charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-sm font-medium text-slate-700">{user?.fullName || "User"}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="accent" size="sm" className="mt-2 w-full" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
