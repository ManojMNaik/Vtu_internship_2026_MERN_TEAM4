import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  User,
  Wrench,
  Calendar,
  LogIn,
  Home,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// Valid roles in the system
const VALID_ROLES = ["guest", "user", "technician", "admin"];

// Route permissions configuration
const ROUTE_CONFIG = {
  // Public routes - accessible without authentication
  public: ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-otp"],
  // Role-specific route permissions
  roleRoutes: {
    user: ["/technicians", "/technician/", "/bookings", "/user/", "/dashboard", "/profile"],
    technician: ["/technician/", "/dashboard", "/profile"],
    admin: ["/admin/", "/dashboard", "/profile"],
  },
};

// FAQ Data Structure with categories and role-based visibility
const FAQ_DATA = [
  // Booking Category
  {
    id: "book-service",
    category: "Booking",
    icon: Calendar,
    question: "How do I book a service?",
    answer:
      "Browse our verified technicians, select a service, choose your preferred date and time, and confirm your booking. You'll receive a confirmation email once your booking is accepted.",
    action: {
      label: "Go to Booking",
      route: "/bookings/new",
    },
    roles: ["user", "guest"],
  },
  {
    id: "find-technicians",
    category: "Booking",
    icon: Search,
    question: "How to find technicians?",
    answer:
      "Visit our technicians page to browse all available professionals. You can filter by location, service type, ratings, and availability to find the perfect match for your needs.",
    action: {
      label: "Browse Technicians",
      route: "/technicians",
    },
    roles: ["user", "guest"], // Removed technician/admin - they can't access this route
  },
  {
    id: "check-bookings",
    category: "Booking",
    icon: BookOpen,
    question: "How to check my bookings?",
    answer:
      "View all your current and past bookings in one place. Track status updates, download invoices, and manage your appointments easily from your bookings dashboard.",
    action: {
      label: "View My Bookings",
      route: "/bookings",
    },
    roles: ["user"],
  },
  {
    id: "cancel-booking",
    category: "Booking",
    icon: Calendar,
    question: "How do I cancel a booking?",
    answer:
      "You can cancel pending bookings from your bookings page. Click on the booking you want to cancel and select 'Cancel Booking'. Note that accepted bookings may have cancellation policies.",
    action: {
      label: "Manage Bookings",
      route: "/bookings",
    },
    roles: ["user"],
  },

  // Account Category
  {
    id: "login",
    category: "Account",
    icon: LogIn,
    question: "How to login?",
    answer:
      "Click the login button and enter your registered email and password. If you haven't verified your email yet, you'll be prompted to complete OTP verification first.",
    action: {
      label: "Go to Login",
      route: "/login",
    },
    roles: ["guest"],
  },
  {
    id: "signup",
    category: "Account",
    icon: User,
    question: "How do I create an account?",
    answer:
      "Sign up with your email address, create a password, and verify your account through the OTP sent to your email. You can register as a customer or as a technician offering services.",
    action: {
      label: "Create Account",
      route: "/signup",
    },
    roles: ["guest"],
  },
  {
    id: "forgot-password",
    category: "Account",
    icon: Settings,
    question: "I forgot my password. What do I do?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your email, and we'll send you an OTP to reset your password securely.",
    action: {
      label: "Reset Password",
      route: "/forgot-password",
    },
    roles: ["guest"],
  },
  {
    id: "view-profile",
    category: "Account",
    icon: User,
    question: "How do I update my profile?",
    answer:
      "Access your profile settings from the dashboard to update your personal information, contact details, and location preferences.",
    action: {
      label: "Go to Profile",
      route: "/profile",
    },
    roles: ["user", "technician", "admin"],
  },
  {
    id: "dashboard",
    category: "Account",
    icon: Home,
    question: "Where is my dashboard?",
    answer:
      "Your personalized dashboard shows your activity summary, recent bookings, and quick actions. It's your central hub for managing everything on ServiceMate.",
    action: {
      label: "Go to Dashboard",
      route: "/dashboard",
    },
    roles: ["user", "technician", "admin"],
  },

  // Technician Category
  {
    id: "tech-manage-bookings",
    category: "Technician",
    icon: Calendar,
    question: "How do I manage my bookings as a technician?",
    answer:
      "Access your technician dashboard to view incoming booking requests, accept or decline jobs, and manage your schedule. You can also complete bookings with billing details.",
    action: {
      label: "Go to Technician Dashboard",
      route: "/technician/bookings",
    },
    roles: ["technician"],
  },
  {
    id: "tech-services",
    category: "Technician",
    icon: Wrench,
    question: "How do I add or manage my services?",
    answer:
      "From your technician workspace, you can add new services, set prices, update descriptions, and toggle service availability. Keep your offerings up to date to attract more customers.",
    action: {
      label: "Manage Services",
      route: "/technician/services",
    },
    roles: ["technician"],
  },
  {
    id: "tech-portfolio",
    category: "Technician",
    icon: BookOpen,
    question: "How do I update my portfolio?",
    answer:
      "Showcase your best work by adding portfolio items with images and descriptions. A strong portfolio helps build trust and attracts more customers to your profile.",
    action: {
      label: "Edit Portfolio",
      route: "/technician/portfolio",
    },
    roles: ["technician"],
  },
  {
    id: "tech-view-earnings",
    category: "Technician",
    icon: Calendar,
    question: "How do I track my earnings?",
    answer:
      "View your completed bookings and earnings from your technician workspace. You can see payment history, pending amounts, and download invoices for your records.",
    action: {
      label: "View Workspace",
      route: "/technician",
    },
    roles: ["technician"],
  },
  {
    id: "become-technician",
    category: "Technician",
    icon: Wrench,
    question: "How do I become a technician on ServiceMate?",
    answer:
      "Sign up as a technician, complete your profile with your skills and experience, add your services and portfolio. Once your profile is complete, customers can discover and book your services.",
    action: {
      label: "Sign Up as Technician",
      route: "/signup",
    },
    roles: ["guest"],
  },

  // General
  {
    id: "contact-support",
    category: "General",
    icon: MessageCircle,
    question: "How do I contact support?",
    answer:
      "For any issues or questions not covered here, please reach out to our support team at support@servicemate.com. We typically respond within 24 hours.",
    roles: ["user", "guest", "technician", "admin"],
  },
];

// Category icons mapping
const CATEGORY_ICONS = {
  Booking: Calendar,
  Account: User,
  Technician: Wrench,
  General: HelpCircle,
};

// Category colors
const CATEGORY_COLORS = {
  Booking: "bg-blue-100 text-blue-700",
  Account: "bg-purple-100 text-purple-700",
  Technician: "bg-orange-100 text-orange-700",
  General: "bg-gray-100 text-gray-700",
};

function FAQItem({ faq, isExpanded, onToggle, onNavigate }) {
  const Icon = faq.icon || HelpCircle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border-b border-gray-100 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className={cn("p-2 rounded-lg shrink-0", CATEGORY_COLORS[faq.category] || "bg-gray-100 text-gray-700")}>
          <Icon className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
        </div>
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-14">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{faq.answer}</p>
              {faq.action && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(faq.action.route)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  {faq.action.label}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
          activeCategory === null ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        All
      </button>
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category] || HelpCircle;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5",
              activeCategory === category ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Icon className="w-3 h-3" />
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosingForExternal, setIsClosingForExternal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const mailtoTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Determine user role with strict checking - NO unsafe fallbacks
  const userRole = useMemo(() => {
    // Not authenticated = guest
    if (!isAuthenticated) return "guest";
    
    // Authenticated but no user object = restrict (return null)
    if (!user) return null;
    
    // Authenticated but role is missing/invalid = restrict (return null)
    const role = user.role;
    if (!role || !VALID_ROLES.includes(role)) return null;
    
    return role;
  }, [isAuthenticated, user]);

  // Filter FAQs based on role with strict checking
  const filteredFAQs = useMemo(() => {
    // If role is null (invalid state), show no FAQs
    if (userRole === null) return [];

    return FAQ_DATA.filter((faq) => {
      // Ensure faq.roles is a valid array
      if (!Array.isArray(faq.roles) || faq.roles.length === 0) return false;

      // Strict role check - must exactly match
      if (!faq.roles.includes(userRole)) return false;

      // Category filter
      if (activeCategory && faq.category !== activeCategory) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
      }

      return true;
    });
  }, [userRole, searchQuery, activeCategory]);

  // Get unique categories from visible FAQs
  const availableCategories = useMemo(() => {
    // If role is null, no categories
    if (userRole === null) return [];
    
    const roleFilteredFAQs = FAQ_DATA.filter((faq) => 
      Array.isArray(faq.roles) && faq.roles.includes(userRole)
    );
    return [...new Set(roleFilteredFAQs.map((faq) => faq.category))];
  }, [userRole]);

  // Ensure pending timers don't outlive this component
  useEffect(() => {
    return () => {
      if (mailtoTimeoutRef.current) {
        clearTimeout(mailtoTimeoutRef.current);
      }
    };
  }, []);

  const closePanel = useCallback((forExternal = false) => {
    setIsClosingForExternal(forExternal);
    setIsOpen(false);
    setExpandedId(null);
    setSearchQuery("");
    setActiveCategory(null);
  }, []);

  // Handle opening the panel
  const handleOpen = useCallback(() => {
    setIsClosingForExternal(false);
    setIsOpen(true);
  }, []);

  // Handle closing the panel - reset states
  const handleClose = useCallback(() => {
    closePanel(false);
  }, [closePanel]);

  // Handle contact support - close modal first, then open mailto
  const handleContactSupport = useCallback(() => {
    // Make overlay non-interactive immediately, then close panel
    closePanel(true);

    if (mailtoTimeoutRef.current) {
      clearTimeout(mailtoTimeoutRef.current);
    }

    // Wait for exit animation, then trigger external mail client
    mailtoTimeoutRef.current = setTimeout(() => {
      setIsClosingForExternal(false);
      window.location.assign("mailto:support@servicemate.com");
      mailtoTimeoutRef.current = null;
    }, 320);
  }, [closePanel]);

  // Handle navigation with strict role-based access control
  const handleNavigate = useCallback((route) => {
    if (!route) return;

    // Check if route is public
    const isPublicRoute = ROUTE_CONFIG.public.some((r) => route === r || route.startsWith(r + "/"));

    // If public route, allow navigation
    if (isPublicRoute) {
      navigate(route);
      handleClose();
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || userRole === null) {
      navigate("/login", { state: { from: route } });
      handleClose();
      return;
    }

    // Check role-specific route permissions
    const allowedRoutes = ROUTE_CONFIG.roleRoutes[userRole] || [];
    const hasPermission = allowedRoutes.some((allowedRoute) => 
      route === allowedRoute ||
      route.startsWith(allowedRoute) ||
      (allowedRoute.endsWith("/") && route === allowedRoute.slice(0, -1))
    );

    if (hasPermission) {
      navigate(route);
    } else {
      // Redirect to unauthorized or dashboard
      navigate("/unauthorized", { 
        state: { from: route } 
      });
    }

    handleClose();
  }, [isAuthenticated, userRole, navigate, handleClose]);

  const toggleFAQ = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Determine if overlay should block pointer events
  // Only true when panel is fully visible (not during exit animation)
  const shouldBlockInteraction = isOpen && !isClosingForExternal;

  return (
    <>
      {/* Floating Help Button - always visible and clickable */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow",
          isOpen && "pointer-events-none opacity-0"
        )}
        aria-label="Open Help & FAQ"
        disabled={isOpen}
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Panel - Backdrop and Panel as separate motion elements */}
      <AnimatePresence mode="sync">
        {isOpen && (
          <>
            {/* Backdrop - fixed position, separate from panel */}
            <motion.div
              key="help-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className={cn(
                "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
                shouldBlockInteraction ? "pointer-events-auto" : "pointer-events-none"
              )}
            />

            {/* Help Panel - fixed position */}
            <motion.div
              key="help-panel"
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col",
                shouldBlockInteraction ? "pointer-events-auto" : "pointer-events-none"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6" />
                  <div>
                    <h2 className="font-semibold text-lg">Help & Support</h2>
                    <p className="text-sm text-primary-foreground/80">How can we help you today?</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close Help Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="px-4 py-3 border-b border-gray-100">
                <CategoryFilter
                  categories={availableCategories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>

              {/* FAQ List */}
              <div className="flex-1 overflow-y-auto">
                {filteredFAQs.length > 0 ? (
                  <motion.div layout className="divide-y divide-gray-100">
                    {filteredFAQs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedId === faq.id}
                        onToggle={() => toggleFAQ(faq.id)}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No results found</p>
                    <p className="text-gray-400 text-sm mt-1">Try different keywords or browse categories</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory(null);
                      }}
                      className="mt-4 text-primary text-sm font-medium hover:underline"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-center text-sm text-gray-500">
                  Still need help?{" "}
                  <button
                    type="button"
                    onClick={handleContactSupport}
                    className="text-primary font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Contact Support
                  </button>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
