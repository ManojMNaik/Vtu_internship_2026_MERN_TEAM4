const express = require("express");
const router = express.Router();
const { protect, requireVerified, authorizeRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/review.controller");

// User creates review
router.post("/", protect, requireVerified, authorizeRoles("user"), ctrl.createReview);

// User views own reviews
router.get("/me", protect, requireVerified, ctrl.getMyReviews);

// Admin toggles visibility
router.patch("/:id/visibility", protect, authorizeRoles("admin"), ctrl.updateReviewVisibility);

module.exports = router;
