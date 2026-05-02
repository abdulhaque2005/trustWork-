const Project = require("../models/Project.model");
const Milestone = require("../models/Milestone.model");
const Payment = require("../models/Payment.model");
const Submission = require("../models/Submission.model");
const Activity = require("../models/Activity.model");
const User = require("../models/User.model");
const Dispute = require("../models/Dispute.model");
const ApiResponse = require("../utils/responseHandler");
const { ROLES } = require("../utils/constants");

// POST /api/projects - Client creates project with milestones
const createProject = async (req, res, next) => {
  try {
    const { title, description, budget, deadline, scope, skills, milestones } = req.body;

    // Only clients can create projects
    if (req.user.role !== ROLES.CLIENT) {
      return ApiResponse.forbidden(res, "Only clients can create projects");
    }

    // Deadline is required
    if (!deadline) {
      return ApiResponse.error(res, "Deadline (expiry date) is required", 400);
    }

    // Validate milestone amounts match budget
    const totalMilestoneAmount = milestones.reduce((sum, m) => sum + Number(m.amount), 0);
    if (totalMilestoneAmount !== Number(budget)) {
      return ApiResponse.error(res, "Milestone amounts must equal total budget", 400);
    }

    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      scope,
      skills,
      clientId: req.user._id,
      progress: 0,
    });

    // Create milestones
    const milestonePromises = milestones.map((m, index) =>
      Milestone.create({
        projectId: project._id,
        title: m.title,
        description: m.description || "",
        amount: m.amount,
        dueDate: m.dueDate || null,
        order: index,
      })
    );
    const createdMilestones = await Promise.all(milestonePromises);

    // Log activity
    await Activity.create({
      projectId: project._id,
      userId: req.user._id,
      type: "project_created",
      message: `Project "${title}" created by ${req.user.name}`,
    });

    return ApiResponse.created(res, { project, milestones: createdMilestones }, "Project created successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/projects - Get projects based on role
const getProjects = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === ROLES.CLIENT) {
      query.clientId = req.user._id;
    } else if (req.user.role === ROLES.FREELANCER) {
      query.$or = [{ freelancerId: req.user._id }, { status: "open" }];
    }
    // Admin sees all

    const projects = await Project.find(query)
      .populate("clientId", "name email avatar")
      .populate("freelancerId", "name email avatar")
      .sort("-createdAt");

    // Auto-check expiry for each project
    const updatedProjects = [];
    for (const p of projects) {
      if (p.deadline && new Date() > p.deadline && !["completed", "expired", "cancelled"].includes(p.status)) {
        p.status = "expired";
        await p.save();
      }
      updatedProjects.push(p);
    }

    return ApiResponse.success(res, { projects: updatedProjects, total: updatedProjects.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/browse - Public projects for freelancers
const browseProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: "open" })
      .populate("clientId", "name email avatar")
      .sort("-createdAt");

    return ApiResponse.success(res, { projects, total: projects.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("clientId", "name email avatar")
      .populate("freelancerId", "name email avatar");

    if (!project) {
      return ApiResponse.notFound(res, "Project not found");
    }

    // Auto-check expiry
    if (project.deadline && new Date() > project.deadline && !["completed", "expired", "cancelled"].includes(project.status)) {
      project.status = "expired";
      await project.save();
    }

    const milestones = await Milestone.find({ projectId: project._id }).sort("order");
    const payments = await Payment.find({ projectId: project._id });
    const activities = await Activity.find({ projectId: project._id })
      .populate("userId", "name avatar")
      .sort("-createdAt")
      .limit(20);

    // Get submissions for each milestone
    const milestonesWithSubmissions = await Promise.all(
      milestones.map(async (ms) => {
        const submissions = await Submission.find({ milestoneId: ms._id })
          .populate("freelancerId", "name avatar")
          .sort("-submittedAt");
        return { ...ms.toObject(), submissions };
      })
    );

    // Calculate progress from milestones
    const completedMs = milestones.filter((m) => m.status === "completed").length;
    const progress = milestones.length > 0 ? Math.round((completedMs / milestones.length) * 100) : 0;

    // Update project progress if changed
    if (project.progress !== progress) {
      project.progress = progress;
      await project.save();
    }

    return ApiResponse.success(res, {
      project,
      milestones: milestonesWithSubmissions,
      payments,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id/assign - Freelancer accepts project
const assignFreelancer = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return ApiResponse.notFound(res, "Project not found");
    if (project.status !== "open") return ApiResponse.error(res, "Project is not open for assignment", 400);
    if (req.user.role !== ROLES.FREELANCER) return ApiResponse.forbidden(res, "Only freelancers can accept projects");
    if (project.freelancerId) return ApiResponse.error(res, "Project already assigned", 400);

    project.freelancerId = req.user._id;
    project.status = "in-progress";
    await project.save();

    // Update first milestone to in-progress
    const firstMilestone = await Milestone.findOne({ projectId: project._id, order: 0 });
    if (firstMilestone) {
      firstMilestone.status = "in-progress";
      await firstMilestone.save();
    }

    await Activity.create({
      projectId: project._id,
      userId: req.user._id,
      type: "freelancer_assigned",
      message: `${req.user.name} accepted this project`,
    });

    return ApiResponse.success(res, { project }, "Project accepted successfully");
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:id/submit - Freelancer submits work
const submitWork = async (req, res, next) => {
  try {
    const { milestoneId, description, demoLink } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return ApiResponse.notFound(res, "Project not found");
    if (req.user.role !== ROLES.FREELANCER) return ApiResponse.forbidden(res, "Only freelancers can submit work");
    if (String(project.freelancerId) !== String(req.user._id)) {
      return ApiResponse.forbidden(res, "You are not assigned to this project");
    }

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) return ApiResponse.notFound(res, "Milestone not found");
    if (String(milestone.projectId) !== String(project._id)) {
      return ApiResponse.error(res, "Milestone does not belong to this project", 400);
    }

    // Validate submission requirements
    if (!description || description.trim().length === 0) {
      return ApiResponse.error(res, "Description is required for submission", 400);
    }

    // Files are required
    if (!req.files || req.files.length === 0) {
      return ApiResponse.error(res, "At least one file is required for submission", 400);
    }

    // Process files
    const files = req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: f.path,
      size: f.size,
    }));

    const submission = await Submission.create({
      milestoneId,
      projectId: project._id,
      freelancerId: req.user._id,
      description,
      demoLink: demoLink || "",
      files,
    });

    // Update milestone status
    milestone.status = "submitted";
    await milestone.save();

    // Update payment status to pending
    const payment = await Payment.findOne({ projectId: project._id, milestoneId });
    if (payment) {
      payment.status = "pending";
      await payment.save();
    }

    await Activity.create({
      projectId: project._id,
      userId: req.user._id,
      type: "work_submitted",
      message: `${req.user.name} submitted work for milestone "${milestone.title}"`,
    });

    return ApiResponse.success(res, { submission }, "Work submitted successfully");
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id/review - Client approves/rejects submission
const reviewSubmission = async (req, res, next) => {
  try {
    const { submissionId, action, feedback } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return ApiResponse.notFound(res, "Project not found");
    if (req.user.role !== ROLES.CLIENT) return ApiResponse.forbidden(res, "Only clients can review");
    if (String(project.clientId) !== String(req.user._id)) {
      return ApiResponse.forbidden(res, "You are not the client of this project");
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) return ApiResponse.notFound(res, "Submission not found");

    const milestone = await Milestone.findById(submission.milestoneId);

    if (action === "approve") {
      submission.status = "approved";
      submission.feedback = feedback || "Approved";
      await submission.save();

      milestone.status = "completed";
      await milestone.save();

      // Release payment
      const payment = await Payment.findOne({ projectId: project._id, milestoneId: milestone._id });
      if (payment) {
        payment.status = "released";
        payment.freelancerId = project.freelancerId;
        payment.releasedAt = new Date();
        await payment.save();
      }

      await Activity.create({
        projectId: project._id,
        userId: req.user._id,
        type: "work_approved",
        message: `Client approved work for milestone "${milestone.title}" — payment released`,
      });

      // Check if all milestones are completed -> update progress
      const allMilestones = await Milestone.find({ projectId: project._id });
      const completedCount = allMilestones.filter((m) => m.status === "completed").length;
      project.progress = Math.round((completedCount / allMilestones.length) * 100);

      const allCompleted = allMilestones.every((m) => m.status === "completed");
      if (allCompleted) {
        project.status = "completed";
        project.progress = 100;
        await project.save();
        await Activity.create({
          projectId: project._id,
          userId: req.user._id,
          type: "project_completed",
          message: "All milestones completed — project finished!",
        });
      } else {
        await project.save();
        // Move next milestone to in-progress
        const nextMilestone = allMilestones.find(
          (m) => m.status === "pending" && m.order > milestone.order
        );
        if (nextMilestone) {
          nextMilestone.status = "in-progress";
          await nextMilestone.save();
        }
      }
    } else if (action === "reject") {
      if (!feedback || feedback.trim().length === 0) {
        return ApiResponse.error(res, "Reason is required when rejecting work", 400);
      }
      submission.status = "rejected";
      submission.feedback = feedback;
      await submission.save();

      milestone.status = "revision";
      await milestone.save();

      await Activity.create({
        projectId: project._id,
        userId: req.user._id,
        type: "work_rejected",
        message: `Client requested revision for milestone "${milestone.title}": ${feedback}`,
      });
    } else {
      return ApiResponse.error(res, "Invalid action. Must be 'approve' or 'reject'", 400);
    }

    return ApiResponse.success(res, { submission, milestone }, `Work ${action}d successfully`);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/stats - Dashboard stats
const getStats = async (req, res, next) => {
  try {
    let stats = {};

    if (req.user.role === ROLES.CLIENT) {
      const projects = await Project.find({ clientId: req.user._id });
      const projectIds = projects.map((p) => p._id);
      const payments = await Payment.find({ projectId: { $in: projectIds } });

      stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "in-progress").length,
        completedProjects: projects.filter((p) => p.status === "completed").length,
        openProjects: projects.filter((p) => p.status === "open").length,
        expiredProjects: projects.filter((p) => p.status === "expired" || (p.deadline && new Date() > p.deadline && p.status !== "completed")).length,
        disputedProjects: projects.filter((p) => p.status === "disputed").length,
        totalInvested: payments.reduce((s, p) => s + p.amount, 0),
        lockedAmount: payments.filter((p) => ["locked", "pending"].includes(p.status)).reduce((s, p) => s + p.amount, 0),
        releasedAmount: payments.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0),
        disputedAmount: payments.filter((p) => p.status === "disputed").reduce((s, p) => s + p.amount, 0),
      };
    } else if (req.user.role === ROLES.FREELANCER) {
      const projects = await Project.find({ freelancerId: req.user._id });
      const projectIds = projects.map((p) => p._id);
      const payments = await Payment.find({ projectId: { $in: projectIds } });

      stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "in-progress").length,
        completedProjects: projects.filter((p) => p.status === "completed").length,
        totalEarned: payments.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0),
        pendingPayments: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
        availableProjects: await Project.countDocuments({ status: "open" }),
      };
    } else {
      // Admin
      const totalPayments = await Payment.find();
      stats = {
        totalProjects: await Project.countDocuments(),
        totalUsers: await User.countDocuments({ role: { $ne: "admin" } }),
        totalClients: await User.countDocuments({ role: "client" }),
        totalFreelancers: await User.countDocuments({ role: "freelancer" }),
        activeProjects: await Project.countDocuments({ status: "in-progress" }),
        completedProjects: await Project.countDocuments({ status: "completed" }),
        openProjects: await Project.countDocuments({ status: "open" }),
        expiredProjects: await Project.countDocuments({ status: "expired" }),
        disputedProjects: await Project.countDocuments({ status: "disputed" }),
        totalRevenue: totalPayments.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0),
        lockedFunds: totalPayments.filter((p) => ["locked", "pending"].includes(p.status)).reduce((s, p) => s + p.amount, 0),
        disputedFunds: totalPayments.filter((p) => p.status === "disputed").reduce((s, p) => s + p.amount, 0),
        openDisputes: await Dispute.countDocuments({ status: { $in: ["open", "under-review"] } }),
      };
    }

    return ApiResponse.success(res, { stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  browseProjects,
  getProjectById,
  assignFreelancer,
  submitWork,
  reviewSubmission,
  getStats,
};
