const User = require("../models/User");
const OtpVerification = require("../models/OtpVerification");
const TechnicianProfile = require("../models/TechnicianProfile");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// ── helpers ────────────────────────────────────────────────────────
const sendOtpEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "ServiceMate – Verify your email",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#2563eb;">ServiceMate</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px;text-align:center;color:#1e293b;">${otp}</h1>
        <p style="color:#64748b;font-size:14px;">This code expires in 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

const createAndSendOtp = async (email) => {
  // Invalidate previous OTPs
  await OtpVerification.deleteMany({ email });

  const otp = generateOtp();

  await OtpVerification.create({
    email,
    otp, // hashed in pre-save hook
    purpose: "signup",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  await sendOtpEmail(email, otp);
};

// ── Register User ──────────────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, phone, role: "user" });

  await createAndSendOtp(email);

  res.status(201).json({
    success: true,
    message: "Registration successful. OTP sent to your email.",
    data: { userId: user._id, email: user.email },
  });
});

// ── Register Technician ────────────────────────────────────────────
exports.registerTechnician = asyncHandler(async (req, res) => {
  const { name, email, password, phone, serviceCategoryId, experienceYears, address, latitude, longitude, bio } =
    req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, phone, role: "technician" });

  await TechnicianProfile.create({
    userId: user._id,
    serviceCategoryId,
    experienceYears,
    bio,
    address,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
  });

  await createAndSendOtp(email);

  res.status(201).json({
    success: true,
    message: "Technician registration successful. OTP sent to your email.",
    data: { userId: user._id, email: user.email },
  });
});

// ── Verify OTP ─────────────────────────────────────────────────────
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const record = await OtpVerification.findOne({ email, purpose: "signup" });

  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
  }

  if (record.expiresAt < new Date()) {
    await OtpVerification.deleteMany({ email });
    return res.status(400).json({ success: false, message: "OTP has expired. Please resend." });
  }

  if (record.attempts >= 3) {
    await OtpVerification.deleteMany({ email });
    return res.status(400).json({ success: false, message: "Too many attempts. Please resend OTP." });
  }

  const isMatch = await record.compareOtp(otp);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({
      success: false,
      message: `Invalid OTP. ${3 - record.attempts} attempt(s) remaining.`,
    });
  }

  // Mark user as verified
  await User.findOneAndUpdate({ email }, { isVerified: true });
  await OtpVerification.deleteMany({ email });

  res.json({ success: true, message: "Email verified successfully" });
});

// ── Resend OTP ─────────────────────────────────────────────────────
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ success: false, message: "Email already verified" });
  }

  await createAndSendOtp(email);

  res.json({ success: true, message: "OTP resent to your email" });
});

// ── Login ──────────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: "Account has been disabled" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Email not verified. Please verify your email first.",
      data: { isVerified: false, email: user.email },
    });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    },
  });
});

// ── Get Current User ───────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  let technicianProfile = null;
  if (user.role === "technician") {
    technicianProfile = await TechnicianProfile.findOne({ userId: user._id }).populate(
      "serviceCategoryId",
      "name slug"
    );
  }

  res.json({
    success: true,
    data: {
      user,
      technicianProfile,
    },
  });
});

// ── Logout (stateless – client discards token) ────────────────────
exports.logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});
