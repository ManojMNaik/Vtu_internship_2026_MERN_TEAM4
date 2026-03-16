const mongoose = require("mongoose");

const technicianActivitySchema = new mongoose.Schema(
  {
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicianProfile",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
    publicId: {
      type: String, // Cloudinary public_id for deletion
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

technicianActivitySchema.index({ technicianId: 1, createdAt: -1 });

module.exports = mongoose.model("TechnicianActivity", technicianActivitySchema);
