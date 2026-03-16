import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import SearchTechnicians from "./pages/SearchTechnicians";
import TechnicianPublicProfile from "./pages/TechnicianPublicProfile";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterTechnician from "./pages/auth/RegisterTechnician";
import VerifyOtp from "./pages/auth/VerifyOtp";

// User pages
import MyBookings from "./pages/user/MyBookings";
import MyReviews from "./pages/user/MyReviews";
import BookService from "./pages/user/BookService";
import BookingDetail from "./pages/user/BookingDetail";

// Technician pages
import TechnicianBookings from "./pages/technician/TechnicianBookings";
import TechnicianPortfolio from "./pages/technician/TechnicianPortfolio";
import TechnicianProfileEdit from "./pages/technician/TechnicianProfileEdit";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTechnicians from "./pages/admin/AdminTechnicians";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCategories from "./pages/admin/AdminCategories";

export default function App() {
  return (
    <Routes>
      {/* ── Public ──────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchTechnicians />} />
      <Route path="/technician/:id" element={<TechnicianPublicProfile />} />

      {/* ── Auth ────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-technician" element={<RegisterTechnician />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ── Booking (logged-in user) ────────────────────── */}
      <Route
        path="/book/:technicianId"
        element={
          <ProtectedRoute roles={["user"]}>
            <BookService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        }
      />

      {/* ── User Dashboard ──────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute roles={["user"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<MyBookings />} />
        <Route path="/dashboard/reviews" element={<MyReviews />} />
      </Route>

      {/* ── Technician Dashboard ────────────────────────── */}
      <Route
        element={
          <ProtectedRoute roles={["technician"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/technician/dashboard" element={<TechnicianBookings />} />
        <Route path="/technician/portfolio" element={<TechnicianPortfolio />} />
        <Route path="/technician/profile" element={<TechnicianProfileEdit />} />
      </Route>

      {/* ── Admin Dashboard ─────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/technicians" element={<AdminTechnicians />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}
