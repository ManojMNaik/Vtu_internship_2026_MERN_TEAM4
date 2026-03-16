const express = require("express");
const router = express.Router();
const { protect, requireVerified, authorizeRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/booking.controller");

// User creates booking
router.post("/", protect, requireVerified, authorizeRoles("user"), ctrl.createBooking);

// User views own bookings
router.get("/me", protect, requireVerified, authorizeRoles("user"), ctrl.getMyBookings);

// Technician views assigned bookings
router.get("/technician", protect, requireVerified, authorizeRoles("technician"), ctrl.getTechnicianBookings);

// Single booking (user, technician, or admin)
router.get("/:id", protect, requireVerified, ctrl.getBookingById);

// User / admin cancel
router.patch("/:id/cancel", protect, requireVerified, ctrl.cancelBooking);

// Technician responds (accept / reject)
router.patch("/:id/respond", protect, requireVerified, authorizeRoles("technician"), ctrl.respondToBooking);

// Technician / admin update status
router.patch("/:id/status", protect, requireVerified, authorizeRoles("technician", "admin"), ctrl.updateBookingStatus);

module.exports = router;
