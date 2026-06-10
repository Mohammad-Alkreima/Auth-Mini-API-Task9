const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth");
const protectedController = require("../controllers/protected.controller");

router.get("/welcome",[auth], asyncHandler(protectedController.welcome));
router.get("/account-summary",[auth], asyncHandler(protectedController.accountSummary));

module.exports = router;