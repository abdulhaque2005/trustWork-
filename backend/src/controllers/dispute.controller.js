const Dispute = require("../models/Dispute.model");
const Payment = require("../models/Payment.model");
const Project = require("../models/Project.model");
const Activity = require("../models/Activity.model");
const ApiResponse = require("../utils/responseHandler");
const { ROLES } = require("../utils/constants");

// POST /api/disputes - Raise a dispute
const raiseDispute = async (req, res, next) => {
  try {
    const { projectId, milestoneId, reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return ApiResponse.error(res, "Reason is required", 400);
    }

    const project = await Project.findById(projectId);
    if (!project) return ApiResponse.notFound(res, "Project not found");

    // Determine against user
    let againstUser;
    if (req.user.role === ROLES.CLIENT) {
      againstUser = project.freelancerId;
    } else if (req.user.role === ROLES.FREELANCER) {
      againstUser = project.clientId;
    } else {
      return ApiResponse.forbidden(res, "Admins cannot raise disputes");
    }

    if (!againstUser) {
      return ApiResponse.error(res, "No counterparty found on this project", 400);
    }

    // Process evidence files
    const evidence = req.files
      ? req.files.map((f) => ({
          filename: f.filename,
          originalName: f.originalname,
          path: f.path,
          size: f.size,
        }))
      : [];

    const dispute = await Dispute.create({
      projectId,
      milestoneId: milestoneId || null,
      raisedBy: req.user._id,
      againstUser,
      reason,
      evidence,
    });

    // Freeze payments
    if (milestoneId) {
      await Payment.updateMany(
        { projectId, milestoneId },
        { status: "disputed" }
      );
    } else {
      await Payment.updateMany(
        { projectId, status: { $in: ["locked", "pending"] } },
        { status: "disputed" }
      );
    }

    // Update project status
    project.status = "disputed";
    await project.save();

    await Activity.create({
      projectId,
      userId: req.user._id,
      type: "dispute_raised",
      message: `Dispute raised by ${req.user.name}: "${reason.substring(0, 80)}..."`,
    });

    return ApiResponse.created(res, { dispute }, "Dispute raised successfully — funds frozen");
  } catch (error) {
    next(error);
  }
};

// GET /api/disputes
const getDisputes = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role !== ROLES.ADMIN) {
      query.$or = [{ raisedBy: req.user._id }, { againstUser: req.user._id }];
    }

    const disputes = await Dispute.find(query)
      .populate("projectId", "title budget status")
      .populate("raisedBy", "name email avatar role")
      .populate("againstUser", "name email avatar role")
      .sort("-createdAt");

    return ApiResponse.success(res, { disputes, total: disputes.length });
  } catch (error) {
    next(error);
  }
};

// PUT /api/disputes/:id/resolve - Admin resolves dispute
const resolveDispute = async (req, res, next) => {
  try {
    const { resolution, adminNote } = req.body;

    if (req.user.role !== ROLES.ADMIN) {
      return ApiResponse.forbidden(res, "Only admins can resolve disputes");
    }

    if (!["release", "refund", "split"].includes(resolution)) {
      return ApiResponse.error(res, "Resolution must be release, refund, or split", 400);
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return ApiResponse.notFound(res, "Dispute not found");

    dispute.status = "resolved";
    dispute.resolution = resolution;
    dispute.adminNote = adminNote || "";
    dispute.resolvedAt = new Date();
    await dispute.save();

    const project = await Project.findById(dispute.projectId);

    // Handle payment resolution
    const disputedPayments = await Payment.find({
      projectId: dispute.projectId,
      status: "disputed",
    });

    if (resolution === "release") {
      // Release to freelancer
      for (const p of disputedPayments) {
        p.status = "released";
        p.freelancerId = project.freelancerId;
        p.releasedAt = new Date();
        await p.save();
      }
    } else if (resolution === "refund") {
      // Refund to client
      for (const p of disputedPayments) {
        p.status = "refunded";
        await p.save();
      }
    } else if (resolution === "split") {
      // Split 50-50
      for (const p of disputedPayments) {
        const halfAmount = p.amount / 2;
        p.status = "released";
        p.amount = halfAmount;
        p.freelancerId = project.freelancerId;
        p.releasedAt = new Date();
        await p.save();

        // Create refund record for client's half
        await Payment.create({
          projectId: dispute.projectId,
          milestoneId: p.milestoneId,
          clientId: p.clientId,
          amount: halfAmount,
          status: "refunded",
        });
      }
    }

    // Update project status
    project.status = "completed";
    await project.save();

    await Activity.create({
      projectId: dispute.projectId,
      userId: req.user._id,
      type: "dispute_resolved",
      message: `Admin resolved dispute: ${resolution}. ${adminNote || ""}`,
    });

    return ApiResponse.success(res, { dispute }, `Dispute resolved: ${resolution}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { raiseDispute, getDisputes, resolveDispute };
