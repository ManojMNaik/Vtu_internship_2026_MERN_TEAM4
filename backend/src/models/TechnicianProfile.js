const mongoose = require("mongoose");

const technicianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    serviceCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
technicianProfileSchema.index({ location: "2dsphere" });
technicianProfileSchema.index({ serviceCategoryId: 1 });
technicianProfileSchema.index({ approvalStatus: 1 });
technicianProfileSchema.index({ isAvailable: 1 });

module.exports = mongoose.model("TechnicianProfile", technicianProfileSchema);
