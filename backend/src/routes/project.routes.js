const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  browseProjects,
  getProjectById,
  assignFreelancer,
  submitWork,
  reviewSubmission,
  getStats,
} = require("../controllers/project.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createProjectValidation } = require("../validations/project.validation");
const upload = require("../middlewares/upload.middleware");

router.get("/stats", protect, getStats);
router.get("/browse", protect, authorize("freelancer"), browseProjects);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, authorize("client"), createProjectValidation, validate, createProject);
router.put("/:id/assign", protect, authorize("freelancer"), assignFreelancer);
router.post("/:id/submit", protect, authorize("freelancer"), upload.array("files", 10), submitWork);
router.put("/:id/review", protect, authorize("client"), reviewSubmission);

module.exports = router;
