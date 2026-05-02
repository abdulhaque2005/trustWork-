const { body } = require("express-validator");

const depositValidation = [
  body("projectId").notEmpty().withMessage("Project ID is required"),
];

module.exports = { depositValidation };
