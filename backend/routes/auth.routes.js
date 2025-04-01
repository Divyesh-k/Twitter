const express = require("express");
const { getMe, login, logout,signup, forgotPassword, resetPassword } = require("../controllers/auth.controller.js");
const { protectedRoute } = require("../middleware/protectedRoute.js");

const router = express.Router();

router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);

router.post("/login", login);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

router.post("/logout", protectedRoute,logout);
module.exports = router;

