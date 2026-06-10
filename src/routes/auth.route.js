const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const { signupValidation, loginValidation } = require("../validations/auth.validate");
const { loginLimiter } = require("../middlewares/limiter");

router.post("/signup",[...signupValidation], asyncHandler(authController.signup));
router.post("/login",[loginLimiter, ...loginValidation], asyncHandler(authController.login));
router.post("/logout",[auth], asyncHandler(authController.logout));
router.get("/profile",[auth], asyncHandler(authController.profile));

module.exports = router;