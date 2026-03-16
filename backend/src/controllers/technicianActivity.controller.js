const TechnicianActivity = require("../models/TechnicianActivity");
const TechnicianProfile = require("../models/TechnicianProfile");
const { cloudinary } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");

// ── Create portfolio item (technician) ─────────────────────────────
exports.createActivity = asyncHandler(async (req, res) => {
  const profile = await TechnicianProfile.findOne({ userId: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  const { title, description, completedAt } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image is required" });
  }

  const activity = await TechnicianActivity.create({
    technicianId: profile._id,
    title,
    description,
    imageUrl: req.file.path,
    publicId: req.file.filename,
    completedAt,
  });

  res.status(201).json({ success: true, message: "Portfolio item added", data: activity });
});

// ── Get own portfolio items (technician) ───────────────────────────
exports.getMyActivities = asyncHandler(async (req, res) => {
  const profile = await TechnicianProfile.findOne({ userId: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  const activities = await TechnicianActivity.find({ technicianId: profile._id }).sort({ createdAt: -1 });

  res.json({ success: true, count: activities.length, data: activities });
});

// ── Get public portfolio for a technician ──────────────────────────
exports.getActivitiesByTechnician = asyncHandler(async (req, res) => {
  const activities = await TechnicianActivity.find({ technicianId: req.params.id }).sort({ createdAt: -1 });

  res.json({ success: true, count: activities.length, data: activities });
});

// ── Update portfolio item (technician) ─────────────────────────────
exports.updateActivity = asyncHandler(async (req, res) => {
  const profile = await TechnicianProfile.findOne({ userId: req.user._id });
  const activity = await TechnicianActivity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({ success: false, message: "Activity not found" });
  }

  if (activity.technicianId.toString() !== profile._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to update this activity" });
  }

  const { title, description, completedAt } = req.body;
  if (title !== undefined) activity.title = title;
  if (description !== undefined) activity.description = description;
  if (completedAt !== undefined) activity.completedAt = completedAt;

  // If a new image is uploaded, replace old one
  if (req.file) {
    if (activity.publicId) {
      await cloudinary.uploader.destroy(activity.publicId);
    }
    activity.imageUrl = req.file.path;
    activity.publicId = req.file.filename;
  }

  await activity.save();

  res.json({ success: true, message: "Activity updated", data: activity });
});

// ── Delete portfolio item (technician) ─────────────────────────────
exports.deleteActivity = asyncHandler(async (req, res) => {
  const profile = await TechnicianProfile.findOne({ userId: req.user._id });
  const activity = await TechnicianActivity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({ success: false, message: "Activity not found" });
  }

  if (activity.technicianId.toString() !== profile._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this activity" });
  }

  // Delete image from Cloudinary
  if (activity.publicId) {
    await cloudinary.uploader.destroy(activity.publicId);
  }

  await activity.deleteOne();

  res.json({ success: true, message: "Activity deleted" });
});
