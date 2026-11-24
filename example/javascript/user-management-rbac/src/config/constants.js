require("dotenv").config();

/**
 * Application constants
 */
module.exports = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  JWT_EXPIRY: "2h",

  // Role-Based Permissions
  ROLE_PERMS: {
    admin: [
      "user:create",
      "user:update",
      "user:delete",
      "role:assign",
      "role:view",
    ],
    manager: ["user:create", "user:update", "role:view"],
    viewer: ["role:view"],
  },

  // Server Configuration
  PORT: process.env.PORT || 3000,
};
