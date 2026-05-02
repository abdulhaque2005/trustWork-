const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 1,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled", "disputed", "expired"],
      default: "open",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    scope: {
      type: String,
      enum: ["small", "medium", "large", "enterprise"],
      default: "medium",
    },
    skills: [String],
  },
  { timestamps: true }
);

// Virtual: days remaining
projectSchema.virtual("daysLeft").get(function () {
  if (!this.deadline) return 0;
  const diff = this.deadline.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual: is expired
projectSchema.virtual("isExpired").get(function () {
  return this.deadline && new Date() > this.deadline && this.status !== "completed";
});

// Ensure virtuals are included in JSON
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);
