import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, Wrench, LogOut, User, LayoutDashboard } from "lucide-react";
import Button from "./ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "technician") return "/technician/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Wrench className="h-6 w-6" />
          ServiceMate
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Find Technicians
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium capitalize text-blue-700">
                  {user.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <Link
            to="/"
            className="block py-2 text-sm font-medium text-gray-600"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/search"
            className="block py-2 text-sm font-medium text-gray-600"
            onClick={() => setMobileOpen(false)}
          >
            Find Technicians
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="block py-2 text-sm font-medium text-gray-600"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="mt-2 w-full rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Login
              </Button>
              <Button size="sm" className="flex-1" onClick={() => { navigate("/register"); setMobileOpen(false); }}>
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
