const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, JWT_EXPIRY } = require("../config/constants");
const db = require("../../models");

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Object with success status, token, and user data or error
 */
async function login(email, password) {
  try {
    if (!db.sequelize || !db.User) {
      throw new Error("Database not configured");
    }

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { success: false, error: "Email atau password salah" };
    }

    const isPasswordValid = await verifyPassword(
      password || "",
      user.passwordHash
    );
    if (!isPasswordValid) {
      return { success: false, error: "Email atau password salah" };
    }

    const token = generateToken(user);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan. Konfigurasi database diperlukan.",
    };
  }
}

/**
 * Verify password against hash
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object from database
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = {
  login,
  verifyPassword,
  generateToken,
  verifyToken,
};
