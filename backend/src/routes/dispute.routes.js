const express = require("express");
const router = express.Router();
const { raiseDispute, getDisputes, resolveDispute } = require("../controllers/dispute.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", protect, getDisputes);
router.post("/", protect, authorize("client", "freelancer"), upload.array("evidence", 5), raiseDispute);
router.put("/:id/resolve", protect, authorize("admin"), resolveDispute);

module.exports = router;
