const Review = require("../models/Review");
const Booking = require("../models/Booking");
const TechnicianProfile = require("../models/TechnicianProfile");
const asyncHandler = require("../utils/asyncHandler");

// Helper – recalculate technician average rating
const recalcRating = async (technicianProfileId) => {
  const result = await Review.aggregate([
    { $match: { technicianProfileId, isVisible: true } },
    {
      $group: {
        _id: "$technicianProfileId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await TechnicianProfile.findByIdAndUpdate(technicianProfileId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      reviewCount: result[0].reviewCount,
    });
  } else {
    await TechnicianProfile.findByIdAndUpdate(technicianProfileId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

// ── Create review (user) ──────────────────────────────────────────
exports.createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only review your own bookings" });
  }

  if (booking.status !== "completed") {
    return res.status(400).json({ success: false, message: "You can only review completed bookings" });
  }

  const existing = await Review.findOne({ bookingId });
  if (existing) {
    return res.status(400).json({ success: false, message: "You have already reviewed this booking" });
  }

  const review = await Review.create({
    bookingId,
    userId: req.user._id,
    technicianUserId: booking.technicianUserId,
    technicianProfileId: booking.technicianProfileId,
    rating,
    comment,
  });

  // Recalculate rating
  await recalcRating(booking.technicianProfileId);

  res.status(201).json({ success: true, message: "Review submitted", data: review });
});

// ── Get reviews for a technician (public) ──────────────────────────
exports.getTechnicianReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    technicianProfileId: req.params.id,
    isVisible: true,
  })
    .populate("userId", "name avatarUrl")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

// ── Get reviews by current user ────────────────────────────────────
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ userId: req.user._id })
    .populate("technicianUserId", "name avatarUrl")
    .populate("technicianProfileId", "address")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

// ── Toggle review visibility (admin) ───────────────────────────────
exports.updateReviewVisibility = asyncHandler(async (req, res) => {
  const { isVisible } = req.body;

  const review = await Review.findByIdAndUpdate(req.params.id, { isVisible }, { new: true });

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  // Recalculate rating after visibility change
  await recalcRating(review.technicianProfileId);

  res.json({ success: true, message: `Review visibility set to ${isVisible}`, data: review });
});
