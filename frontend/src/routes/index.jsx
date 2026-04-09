import AdminDashboardPage from "@/pages/AdminDashboardPage";
import { Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import BookingCreatePage from "@/pages/BookingCreatePage";
import CompleteProfilePage from "@/pages/CompleteProfilePage";
import DashboardRedirectPage from "@/pages/DashboardRedirectPage";
import LoginPage from "@/pages/LoginPage";
import OtpVerificationPage from "@/pages/OtpVerificationPage";
import SignupPage from "@/pages/SignupPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import TechnicianBookingsPage from "@/pages/TechnicianBookingsPage";
import TechnicianServicesPage from "@/pages/TechnicianServicesPage";
import TechnicianPortfolioPage from "@/pages/TechnicianPortfolioPage";
import TechnicianWorkspacePage from "@/pages/TechnicianWorkspacePage";
import TechnicianListingPage from "@/pages/TechnicianListingPage";
import TechnicianProfilePage from "@/pages/TechnicianProfilePage";
import UserBookingsPage from "@/pages/UserBookingsPage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { ROLES } from "@/config/rbac";

export const routesConfig = [
  // Public routes
  {
    path: "/",
    element: <AppLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/verify-otp", element: <OtpVerificationPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  // Authenticated routes (any role)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardRedirectPage /> },
          { path: "/profile", element: <CompleteProfilePage /> },
          { path: "/complete-profile", element: <CompleteProfilePage /> },
        ],
      },
    ],
  },

  // User-only routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.USER]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/technicians", element: <TechnicianListingPage /> },
          { path: "/technician/:id", element: <TechnicianProfilePage /> },
          { path: "/technicians/:id", element: <Navigate to="/technicians" replace /> },
          { path: "/user/dashboard", element: <UserDashboardPage /> },
          { path: "/bookings", element: <UserBookingsPage /> },
          { path: "/bookings/new", element: <BookingCreatePage /> },
        ],
      },
    ],
  },

  // Technician-only routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.TECHNICIAN]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/technician", element: <TechnicianWorkspacePage /> },
          { path: "/technician/dashboard", element: <Navigate to="/technician" replace /> },
          { path: "/technician/bookings", element: <TechnicianBookingsPage /> },
          { path: "/technician/services", element: <TechnicianServicesPage /> },
          { path: "/technician/portfolio", element: <TechnicianPortfolioPage /> },
        ],
      },
    ],
  },

  // Admin-only routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/admin/dashboard", element: <AdminDashboardPage /> }],
      },
    ],
  },

  // Catch-all redirect
  { path: "*", element: <Navigate to="/" replace /> },
];
