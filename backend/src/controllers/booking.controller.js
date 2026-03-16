const Booking = require("../models/Booking");
const TechnicianProfile = require("../models/TechnicianProfile");
const asyncHandler = require("../utils/asyncHandler");

// Valid status transitions
const VALID_TRANSITIONS = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
};

// ── Create booking (user) ──────────────────────────────────────────
exports.createBooking = asyncHandler(async (req, res) => {
  const { technicianProfileId, serviceCategoryId, bookingDate, address, latitude, longitude, issueDescription } =
    req.body;

  const techProfile = await TechnicianProfile.findById(technicianProfileId);
  if (!techProfile) {
    return res.status(404).json({ success: false, message: "Technician not found" });
  }

  if (techProfile.approvalStatus !== "approved") {
    return res.status(400).json({ success: false, message: "Technician is not yet approved" });
  }

  const bookingData = {
    userId: req.user._id,
    technicianUserId: techProfile.userId,
    technicianProfileId: techProfile._id,
    serviceCategoryId,
    bookingDate,
    address,
    issueDescription,
    status: "pending",
    statusHistory: [
      {
        status: "pending",
        changedBy: req.user._id,
        changedAt: new Date(),
        note: "Booking created",
      },
    ],
  };

  if (latitude && longitude) {
    bookingData.location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
  }

  const booking = await Booking.create(bookingData);

  res.status(201).json({ success: true, message: "Booking created", data: booking });
});

// ── Get user's bookings ────────────────────────────────────────────
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("technicianUserId", "name avatarUrl")
    .populate("serviceCategoryId", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// ── Get technician's bookings ──────────────────────────────────────
exports.getTechnicianBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ technicianUserId: req.user._id })
    .populate("userId", "name email phone avatarUrl")
    .populate("serviceCategoryId", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// ── Get single booking ─────────────────────────────────────────────
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email phone avatarUrl")
    .populate("technicianUserId", "name email phone avatarUrl")
    .populate("technicianProfileId", "experienceYears averageRating address")
    .populate("serviceCategoryId", "name slug");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  // Only related user, technician, or admin can view
  const isOwner = booking.userId._id.toString() === req.user._id.toString();
  const isTechnician = booking.technicianUserId._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isTechnician && !isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.json({ success: true, data: booking });
});

// ── Cancel booking (user / admin) ──────────────────────────────────
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (!VALID_TRANSITIONS[booking.status] || !VALID_TRANSITIONS[booking.status].includes("cancelled")) {
    return res.status(400).json({ success: false, message: `Cannot cancel a booking with status "${booking.status}"` });
  }

  booking.status = "cancelled";
  booking.cancelledBy = isAdmin ? "admin" : "user";
  booking.statusHistory.push({
    status: "cancelled",
    changedBy: req.user._id,
    changedAt: new Date(),
    note: req.body.note || "Booking cancelled",
  });

  await booking.save();

  res.json({ success: true, message: "Booking cancelled", data: booking });
});

// ── Technician responds (accept / reject) ──────────────────────────
exports.respondToBooking = asyncHandler(async (req, res) => {
  const { action, note } = req.body; // action: "accepted" | "rejected"

  if (!["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ success: false, message: "Action must be 'accepted' or 'rejected'" });
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (booking.technicianUserId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (booking.status !== "pending") {
    return res.status(400).json({ success: false, message: "Only pending bookings can be accepted or rejected" });
  }

  booking.status = action;
  if (action === "rejected" && note) booking.rejectionReason = note;
  booking.statusHistory.push({
    status: action,
    changedBy: req.user._id,
    changedAt: new Date(),
    note: note || `Booking ${action}`,
  });

  await booking.save();

  res.json({ success: true, message: `Booking ${action}`, data: booking });
});

// ── Update booking status (technician / admin) ─────────────────────
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const isTechnician = booking.technicianUserId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isTechnician && !isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (!VALID_TRANSITIONS[booking.status] || !VALID_TRANSITIONS[booking.status].includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: `Cannot transition from "${booking.status}" to "${status}"` });
  }

  booking.status = status;
  if (status === "completed" && note) booking.completionNote = note;
  if (status === "cancelled") booking.cancelledBy = isAdmin ? "admin" : "technician";

  booking.statusHistory.push({
    status,
    changedBy: req.user._id,
    changedAt: new Date(),
    note: note || `Status changed to ${status}`,
  });

  // Increment technician completed jobs
  if (status === "completed") {
    await TechnicianProfile.findByIdAndUpdate(booking.technicianProfileId, {
      $inc: { completedJobs: 1 },
    });
  }

  await booking.save();

  res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
});
