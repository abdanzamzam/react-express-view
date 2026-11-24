const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requirePermission } = require("../middleware/permission.middleware");

// Get all users
router.get("/api/users", userController.getUsers);

// Create user (requires user:create permission)
router.post(
  "/api/users",
  requirePermission("user:create"),
  userController.createUser
);

// Update user (requires user:update permission)
router.put(
  "/api/users/:id",
  requirePermission("user:update"),
  userController.updateUser
);

// Delete user (requires user:delete permission)
router.delete(
  "/api/users/:id",
  requirePermission("user:delete"),
  userController.deleteUser
);

module.exports = router;
