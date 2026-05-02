const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");
const ApiResponse = require("../utils/responseHandler");

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // STRICT: Block admin registration — no user can register as admin
    if (role === "admin") {
      return ApiResponse.forbidden(res, "Admin registration is not allowed. Only the default admin account exists.");
    }

    // Only client or freelancer roles allowed
    if (role && !["client", "freelancer"].includes(role)) {
      return ApiResponse.error(res, "Invalid role. Must be 'client' or 'freelancer'", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, "Email already registered", 400);
    }

    const user = await User.create({ name, email, password, role: role || "client" });

    const token = generateToken(user);

    return ApiResponse.created(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    }, "Registration successful");
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    return ApiResponse.success(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        lastActivity: user.lastActivity,
        createdAt: user.createdAt,
      },
      token,
    }, "Login successful");
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, { user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, skills, avatar },
      { new: true, runValidators: true }
    );
    return ApiResponse.success(res, { user }, "Profile updated");
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    return ApiResponse.success(res, { users, total: users.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, getAllUsers };
