const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { protect } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/auth.controller");

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many requests. Please try again later." },
});

router.post("/register", authLimiter, ctrl.register);
router.post("/register-technician", authLimiter, ctrl.registerTechnician);
router.post("/verify-otp", authLimiter, ctrl.verifyOtp);
router.post("/resend-otp", authLimiter, ctrl.resendOtp);
router.post("/login", authLimiter, ctrl.login);
router.get("/me", protect, ctrl.getMe);
router.post("/logout", protect, ctrl.logout);

module.exports = router;
