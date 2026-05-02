const Payment = require("../models/Payment.model");
const Project = require("../models/Project.model");
const Milestone = require("../models/Milestone.model");
const Activity = require("../models/Activity.model");
const ApiResponse = require("../utils/responseHandler");
const { ROLES } = require("../utils/constants");

// POST /api/payments/deposit - Client deposits escrow for all unfunded milestones
const depositFunds = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    if (req.user.role !== ROLES.CLIENT) {
      return ApiResponse.forbidden(res, "Only clients can deposit");
    }

    const project = await Project.findById(projectId);
    if (!project) return ApiResponse.notFound(res, "Project not found");
    if (String(project.clientId) !== String(req.user._id)) {
      return ApiResponse.forbidden(res, "You are not the client of this project");
    }

    // Get all milestones for this project
    const milestones = await Milestone.find({ projectId }).sort("order");
    if (milestones.length === 0) {
      return ApiResponse.error(res, "No milestones found for this project", 400);
    }

    // Find milestones that don't have a payment yet
    const paymentsToCreate = [];
    for (const ms of milestones) {
      const existingPayment = await Payment.findOne({ projectId, milestoneId: ms._id });
      if (!existingPayment) {
        paymentsToCreate.push({
          projectId,
          milestoneId: ms._id,
          clientId: req.user._id,
          amount: ms.amount,
          status: "locked",
        });
      }
    }

    if (paymentsToCreate.length === 0) {
      return ApiResponse.error(res, "All milestones already have escrow deposits", 400);
    }

    // Validate total won't exceed budget
    const existingPayments = await Payment.find({ projectId });
    const totalExisting = existingPayments.reduce((s, p) => s + p.amount, 0);
    const newTotal = paymentsToCreate.reduce((s, p) => s + p.amount, 0);

    if (totalExisting + newTotal > project.budget) {
      return ApiResponse.error(res, "Total deposits would exceed project budget", 400);
    }

    const payments = await Payment.insertMany(paymentsToCreate);

    await Activity.create({
      projectId,
      userId: req.user._id,
      type: "payment_locked",
      message: `Client deposited $${newTotal} into escrow for ${payments.length} milestone(s)`,
    });

    return ApiResponse.created(res, { payments, totalDeposited: totalExisting + newTotal }, "Funds deposited and locked in escrow");
  } catch (error) {
    next(error);
  }
};

// GET /api/payments - Get payments by role
const getPayments = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === ROLES.CLIENT) {
      query.clientId = req.user._id;
    } else if (req.user.role === ROLES.FREELANCER) {
      query.freelancerId = req.user._id;
    }
    // Admin sees all

    const payments = await Payment.find(query)
      .populate("projectId", "title status")
      .populate("milestoneId", "title status")
      .populate("clientId", "name email")
      .populate("freelancerId", "name email")
      .sort("-createdAt");

    // Calculate summary
    const summary = {
      total: payments.reduce((s, p) => s + p.amount, 0),
      locked: payments.filter((p) => p.status === "locked").reduce((s, p) => s + p.amount, 0),
      pending: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
      released: payments.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0),
      disputed: payments.filter((p) => p.status === "disputed").reduce((s, p) => s + p.amount, 0),
    };

    return ApiResponse.success(res, { payments, summary });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/project/:projectId
const getProjectPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ projectId: req.params.projectId })
      .populate("milestoneId", "title status order")
      .sort("createdAt");

    return ApiResponse.success(res, { payments });
  } catch (error) {
    next(error);
  }
};

module.exports = { depositFunds, getPayments, getProjectPayments };
