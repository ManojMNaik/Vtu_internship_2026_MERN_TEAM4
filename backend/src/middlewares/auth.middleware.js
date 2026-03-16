const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verify JWT token and attach user to request.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized – no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been disabled" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized – invalid token" });
  }
};

/**
 * Require email-verified account.
 */
const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ success: false, message: "Email not verified" });
  }
  next();
};

/**
 * Role-based access control.
 * Usage: authorizeRoles("admin") or authorizeRoles("user", "admin")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};

/**
 * Ensure technician profile is approved.
 */
const requireApprovedTechnician = async (req, res, next) => {
  const TechnicianProfile = require("../models/TechnicianProfile");
  const profile = await TechnicianProfile.findOne({ userId: req.user._id });

  if (!profile || profile.approvalStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Technician profile not approved yet",
    });
  }

  req.technicianProfile = profile;
  next();
};

module.exports = { protect, requireVerified, authorizeRoles, requireApprovedTechnician };
