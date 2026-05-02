const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Milestone title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: [true, "Milestone amount is required"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submitted", "revision", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
