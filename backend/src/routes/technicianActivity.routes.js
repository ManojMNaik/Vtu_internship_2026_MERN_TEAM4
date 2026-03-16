const express = require("express");
const router = express.Router();
const { protect, requireVerified, authorizeRoles } = require("../middlewares/auth.middleware");
const { upload } = require("../config/cloudinary");
const ctrl = require("../controllers/technicianActivity.controller");

// Technician routes
router.post(
  "/",
  protect,
  requireVerified,
  authorizeRoles("technician"),
  upload.single("image"),
  ctrl.createActivity
);
router.get("/me", protect, requireVerified, authorizeRoles("technician"), ctrl.getMyActivities);
router.patch(
  "/:id",
  protect,
  requireVerified,
  authorizeRoles("technician"),
  upload.single("image"),
  ctrl.updateActivity
);
router.delete("/:id", protect, requireVerified, authorizeRoles("technician"), ctrl.deleteActivity);

module.exports = router;
