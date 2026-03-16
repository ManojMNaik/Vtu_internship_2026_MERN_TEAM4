const TechnicianProfile = require("../models/TechnicianProfile");
const asyncHandler = require("../utils/asyncHandler");

// ── Nearby technicians (public) ────────────────────────────────────
exports.getNearbyTechnicians = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm = 10, serviceCategoryId, isAvailable, sortBy = "distance" } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "lat and lng query params are required" });
  }

  const radiusInMeters = parseFloat(radiusKm) * 1000;

  const matchStage = {
    approvalStatus: "approved",
  };
  if (serviceCategoryId) matchStage.serviceCategoryId = require("mongoose").Types.ObjectId(serviceCategoryId);
  if (isAvailable !== undefined) matchStage.isAvailable = isAvailable === "true";

  const pipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: "distance",
        maxDistance: radiusInMeters,
        spherical: true,
        query: matchStage,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "servicecategories",
        localField: "serviceCategoryId",
        foreignField: "_id",
        as: "serviceCategory",
      },
    },
    { $unwind: "$serviceCategory" },
    {
      $project: {
        _id: 1,
        userId: 1,
        "user.name": 1,
        "user.avatarUrl": 1,
        "serviceCategory.name": 1,
        "serviceCategory.slug": 1,
        experienceYears: 1,
        bio: 1,
        address: 1,
        location: 1,
        isAvailable: 1,
        averageRating: 1,
        reviewCount: 1,
        completedJobs: 1,
        distance: 1,
      },
    },
  ];

  if (sortBy === "rating") {
    pipeline.push({ $sort: { averageRating: -1, distance: 1 } });
  }
  // distance is default from $geoNear

  const technicians = await TechnicianProfile.aggregate(pipeline);

  res.json({
    success: true,
    count: technicians.length,
    data: technicians,
  });
});

// ── Get all technicians (admin or public approved list) ────────────
exports.getTechnicians = asyncHandler(async (req, res) => {
  const filter = {};

  // Non-admin only sees approved
  if (!req.user || req.user.role !== "admin") {
    filter.approvalStatus = "approved";
  }

  const technicians = await TechnicianProfile.find(filter)
    .populate("userId", "name email avatarUrl")
    .populate("serviceCategoryId", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: technicians.length, data: technicians });
});

// ── Get single technician profile (public) ─────────────────────────
exports.getTechnicianById = asyncHandler(async (req, res) => {
  const technician = await TechnicianProfile.findById(req.params.id)
    .populate("userId", "name email phone avatarUrl")
    .populate("serviceCategoryId", "name slug");

  if (!technician) {
    return res.status(404).json({ success: false, message: "Technician not found" });
  }

  res.json({ success: true, data: technician });
});

// ── Update own profile (technician) ────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const { experienceYears, bio, address, latitude, longitude, serviceCategoryId } = req.body;

  const update = {};
  if (experienceYears !== undefined) update.experienceYears = experienceYears;
  if (bio !== undefined) update.bio = bio;
  if (address !== undefined) update.address = address;
  if (serviceCategoryId !== undefined) update.serviceCategoryId = serviceCategoryId;
  if (latitude !== undefined && longitude !== undefined) {
    update.location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
  }

  const profile = await TechnicianProfile.findOneAndUpdate({ userId: req.user._id }, update, {
    new: true,
    runValidators: true,
  }).populate("serviceCategoryId", "name slug");

  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  res.json({ success: true, message: "Profile updated", data: profile });
});

// ── Toggle availability (technician) ───────────────────────────────
exports.updateAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;

  const profile = await TechnicianProfile.findOneAndUpdate(
    { userId: req.user._id },
    { isAvailable },
    { new: true }
  );

  if (!profile) {
    return res.status(404).json({ success: false, message: "Technician profile not found" });
  }

  res.json({ success: true, message: `Availability set to ${isAvailable}`, data: profile });
});
