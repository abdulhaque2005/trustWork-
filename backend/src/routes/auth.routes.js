const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, getAllUsers } = require("../controllers/auth.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerValidation, loginValidation } = require("../validations/auth.validation");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, getAllUsers);

module.exports = router;
