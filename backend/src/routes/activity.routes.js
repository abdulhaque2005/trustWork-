const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity.model");
const { protect } = require("../middlewares/auth.middleware");
const ApiResponse = require("../utils/responseHandler");

// GET /api/activities - Get recent activities
router.get("/", protect, async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate("userId", "name avatar role")
      .populate("projectId", "title status")
      .sort("-createdAt")
      .limit(50);

    return ApiResponse.success(res, { activities, total: activities.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/activities/project/:projectId - Get activities for a project
router.get("/project/:projectId", protect, async (req, res, next) => {
  try {
    const activities = await Activity.find({ projectId: req.params.projectId })
      .populate("userId", "name avatar role")
      .sort("-createdAt")
      .limit(30);

    return ApiResponse.success(res, { activities });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
