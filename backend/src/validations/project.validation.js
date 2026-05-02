const { body } = require("express-validator");

const createProjectValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").notEmpty().withMessage("Description is required"),
  body("budget").isNumeric().withMessage("Budget must be a number").custom((v) => v > 0 || Promise.reject("Budget must be positive")),
  body("deadline").isISO8601().withMessage("Valid deadline is required"),
  body("scope").optional().isIn(["small", "medium", "large", "enterprise"]),
  body("milestones").isArray({ min: 1 }).withMessage("At least one milestone is required"),
  body("milestones.*.title").notEmpty().withMessage("Milestone title is required"),
  body("milestones.*.amount").isNumeric().withMessage("Milestone amount is required"),
];

module.exports = { createProjectValidation };
