const express = require("express");
const router = express.Router();
const { protect, requireVerified, authorizeRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/technician.controller");
const reviewCtrl = require("../controllers/review.controller");
const activityCtrl = require("../controllers/technicianActivity.controller");

// Public
router.get("/nearby", ctrl.getNearbyTechnicians);
router.get("/", ctrl.getTechnicians);
router.get("/:id", ctrl.getTechnicianById);
router.get("/:id/reviews", reviewCtrl.getTechnicianReviews);
router.get("/:id/activities", activityCtrl.getActivitiesByTechnician);

// Technician only
router.patch("/profile", protect, requireVerified, authorizeRoles("technician"), ctrl.updateProfile);
router.patch("/availability", protect, requireVerified, authorizeRoles("technician"), ctrl.updateAvailability);

module.exports = router;
