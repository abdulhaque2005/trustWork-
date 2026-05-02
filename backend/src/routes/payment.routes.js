const express = require("express");
const router = express.Router();
const { depositFunds, getPayments, getProjectPayments } = require("../controllers/payment.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { depositValidation } = require("../validations/payment.validation");

router.get("/", protect, getPayments);
router.get("/project/:projectId", protect, getProjectPayments);
router.post("/deposit", protect, authorize("client"), depositValidation, validate, depositFunds);

module.exports = router;
