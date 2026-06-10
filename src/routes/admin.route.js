const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const protectedController = require("../controllers/protected.controller");
const { id } = require("../validations/protected.validate");

router.get("/overview",[auth, role(["admin"])], asyncHandler(protectedController.overview));
router.get("/users",[auth, role(["admin"])], asyncHandler(protectedController.users));
router.delete("/users/:id",[auth, ...id, role(["admin"])], asyncHandler(protectedController.user));

module.exports = router;