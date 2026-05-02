const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["locked", "pending", "released", "disputed", "refunded"],
      default: "locked",
    },
    releasedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
