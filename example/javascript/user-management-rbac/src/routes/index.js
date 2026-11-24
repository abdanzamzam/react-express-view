const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const pageRoutes = require("./page.routes");

// Mount routes
router.use(authRoutes);
router.use(userRoutes);
router.use(pageRoutes);

module.exports = router;
