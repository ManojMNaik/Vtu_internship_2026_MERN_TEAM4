const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/admin.controller");

// All admin routes require admin role
router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", ctrl.getDashboard);

// Users
router.get("/users", ctrl.getUsers);
router.patch("/users/:id/status", ctrl.updateUserStatus);

// Technicians
router.get("/technicians", ctrl.getTechnicians);
router.patch("/technicians/:id/approval", ctrl.updateTechnicianApproval);

// Bookings
router.get("/bookings", ctrl.getBookings);
router.patch("/bookings/:id/cancel", ctrl.cancelBooking);

// Reviews
router.get("/reviews", ctrl.getReviews);

module.exports = router;
