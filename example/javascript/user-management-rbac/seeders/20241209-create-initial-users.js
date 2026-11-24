"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password untuk admin
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const managerPasswordHash = await bcrypt.hash("manager123", 10);
    const viewerPasswordHash = await bcrypt.hash("viewer123", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          password_hash: adminPasswordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Manager User",
          email: "manager@example.com",
          role: "manager",
          password_hash: managerPasswordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Viewer User",
          email: "viewer@example.com",
          role: "viewer",
          password_hash: viewerPasswordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: {
          [Sequelize.Op.in]: [
            "admin@example.com",
            "manager@example.com",
            "viewer@example.com",
          ],
        },
      },
      {}
    );
  },
};
