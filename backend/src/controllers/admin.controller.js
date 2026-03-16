const User = require("../models/User");
const TechnicianProfile = require("../models/TechnicianProfile");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");

// ── Dashboard analytics ────────────────────────────────────────────
exports.getDashboard = asyncHandler(async (_req, res) => {
  const [totalUsers, totalTechnicians, totalBookings, completedBookings, pendingTechnicians, totalReviews] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      TechnicianProfile.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "completed" }),
      TechnicianProfile.countDocuments({ approvalStatus: "pending" }),
      Review.countDocuments(),
    ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalTechnicians,
      totalBookings,
      completedBookings,
      pendingTechnicians,
      totalReviews,
    },
  });
});

// ── Get all users ──────────────────────────────────────────────────
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: users,
  });
});

// ── Enable / disable user ──────────────────────────────────────────
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: `User ${isActive ? "enabled" : "disabled"}`, data: user });
});

// ── Get all technician profiles ────────────────────────────────────
exports.getTechnicians = asyncHandler(async (req, res) => {
  const { approvalStatus, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (approvalStatus) filter.approvalStatus = approvalStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [technicians, total] = await Promise.all([
    TechnicianProfile.find(filter)
      .populate("userId", "name email phone isActive avatarUrl")
      .populate("serviceCategoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    TechnicianProfile.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: technicians.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: technicians,
  });
});

// ── Approve / reject technician ────────────────────────────────────
exports.updateTechnicianApproval = asyncHandler(async (req, res) => {
  const { approvalStatus } = req.body;

  if (!["approved", "rejected"].includes(approvalStatus)) {
    return res.status(400).json({ success: false, message: "approvalStatus must be 'approved' or 'rejected'" });
  }

  const profile = await TechnicianProfile.findByIdAndUpdate(req.params.id, { approvalStatus }, { new: true })
    .populate("userId", "name email")
    .populate("serviceCategoryId", "name");

  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  res.json({ success: true, message: `Technician ${approvalStatus}`, data: profile });
});

// ── Get all bookings ───────────────────────────────────────────────
exports.getBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("userId", "name email")
      .populate("technicianUserId", "name email")
      .populate("serviceCategoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: bookings.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: bookings,
  });
});

// ── Admin cancel booking ───────────────────────────────────────────
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (["completed", "cancelled", "rejected"].includes(booking.status)) {
    return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
  }

  booking.status = "cancelled";
  booking.cancelledBy = "admin";
  booking.statusHistory.push({
    status: "cancelled",
    changedBy: req.user._id,
    changedAt: new Date(),
    note: req.body.note || "Cancelled by admin",
  });

  await booking.save();

  res.json({ success: true, message: "Booking cancelled by admin", data: booking });
});

// ── Get all reviews (moderation) ───────────────────────────────────
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [reviews, total] = await Promise.all([
    Review.find()
      .populate("userId", "name email")
      .populate("technicianUserId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments(),
  ]);

  res.json({
    success: true,
    count: reviews.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: reviews,
  });
});
