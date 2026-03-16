const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Route imports
const authRoutes = require("./routes/auth.routes");
const serviceCategoryRoutes = require("./routes/serviceCategory.routes");
const technicianRoutes = require("./routes/technician.routes");
const technicianActivityRoutes = require("./routes/technicianActivity.routes");
const bookingRoutes = require("./routes/booking.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");

// Middleware imports
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

// ── Global middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check ───────────────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "ServiceMate API is running" });
});

// ── API routes ─────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/service-categories", serviceCategoryRoutes);
app.use("/api/v1/technicians", technicianRoutes);
app.use("/api/v1/technician-activities", technicianActivityRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin", adminRoutes);

// ── Error handling ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
