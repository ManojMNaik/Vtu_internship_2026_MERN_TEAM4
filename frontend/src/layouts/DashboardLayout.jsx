import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import {
  LayoutDashboard,
  CalendarCheck,
  Star,
  UserCog,
  Image,
  Users,
  Wrench,
  BookOpen,
  MessageSquare,
  BarChart3,
  FolderOpen,
} from "lucide-react";

const userLinks = [
  { to: "/dashboard", label: "My Bookings", icon: CalendarCheck },
  { to: "/dashboard/reviews", label: "My Reviews", icon: Star },
];

const techLinks = [
  { to: "/technician/dashboard", label: "Bookings", icon: CalendarCheck },
  { to: "/technician/portfolio", label: "Portfolio", icon: Image },
  { to: "/technician/profile", label: "Profile", icon: UserCog },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/technicians", label: "Technicians", icon: Wrench },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/categories", label: "Categories", icon: FolderOpen },
];

export default function DashboardLayout() {
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "technician"
      ? techLinks
      : userLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-app flex gap-6 py-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
