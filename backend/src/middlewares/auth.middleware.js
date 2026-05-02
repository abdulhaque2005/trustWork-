const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/User.model");
const ApiResponse = require("../utils/responseHandler");

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return ApiResponse.unauthorized(res, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return ApiResponse.unauthorized(res, "User not found");
    }

    // Update last activity (throttled — only write if >5 min since last update)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (!req.user.lastActivity || req.user.lastActivity < fiveMinAgo) {
      req.user.lastActivity = new Date();
      await req.user.save({ validateBeforeSave: false });
    }

    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, "Not authorized, token failed");
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, `Role '${req.user.role}' is not authorized`);
    }
    next();
  };
};

module.exports = { protect, authorize };
