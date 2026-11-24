const express = require("express");
const router = express.Router();
const pageController = require("../controllers/page.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// Home page (protected - requires authentication)
router.get("/", requireAuth, pageController.showHomePage);

module.exports = router;
