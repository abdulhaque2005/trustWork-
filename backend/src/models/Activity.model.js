const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "project_created",
        "freelancer_assigned",
        "milestone_created",
        "work_submitted",
        "work_approved",
        "work_rejected",
        "payment_locked",
        "payment_released",
        "dispute_raised",
        "dispute_resolved",
        "project_completed",
        "general",
      ],
      default: "general",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
