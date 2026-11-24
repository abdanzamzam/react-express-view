const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Login page
router.get("/login", authController.showLoginPage);

// Login form submission
router.post("/login", authController.handleLogin);

// Logout
router.post("/logout", authController.handleLogout);

module.exports = router;
