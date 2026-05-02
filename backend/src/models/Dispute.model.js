const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      default: null,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    againstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
    },
    evidence: [
      {
        filename: String,
        originalName: String,
        path: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: ["open", "under-review", "resolved", "dismissed"],
      default: "open",
    },
    resolution: {
      type: String,
      enum: ["none", "release", "refund", "split"],
      default: "none",
    },
    adminNote: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);
