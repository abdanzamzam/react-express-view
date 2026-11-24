const bcrypt = require("bcryptjs");
const db = require("../../models");

/**
 * Get all users from database
 * @returns {Promise<Object>} Object with success status and users array or error
 */
async function getAllUsers() {
  try {
    if (!db.sequelize || !db.User) {
      return { success: false, error: "Database belum dikonfigurasi" };
    }

    const users = await db.User.findAll({
      attributes: ["id", "name", "email", "role"],
      order: [["id", "DESC"]],
    });

    return { success: true, users };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} Object with success status and user data or error
 */
async function getUserById(id) {
  try {
    if (!db.sequelize || !db.User) {
      return { success: false, error: "Database belum dikonfigurasi" };
    }

    const user = await db.User.findByPk(id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan" };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data pengguna" };
  }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
async function getUserByEmail(email) {
  try {
    if (!db.sequelize || !db.User) {
      return null;
    }

    return await db.User.findOne({ where: { email } });
  } catch (error) {
    return null;
  }
}

/**
 * Create new user
 * @param {Object} userData - User data (name, email, role, password)
 * @returns {Promise<Object>} Object with success status and created user or error
 */
async function createUser(userData) {
  try {
    if (!db.sequelize || !db.User) {
      return { success: false, error: "Database belum dikonfigurasi" };
    }

    const { name, email, role, password } = userData;

    if (!name || !email || !password) {
      return { success: false, error: "Data tidak lengkap" };
    }

    const passwordHash = await hashPassword(password);
    const user = await db.User.create({
      name,
      email,
      role: role || "viewer",
      passwordHash,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    return { success: false, error: "Gagal membuat pengguna" };
  }
}

/**
 * Update existing user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Object with success status and updated user or error
 */
async function updateUser(id, userData) {
  try {
    if (!db.sequelize || !db.User) {
      return { success: false, error: "Database belum dikonfigurasi" };
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan" };
    }

    const { name, email, role, password } = userData;

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    if (password) {
      user.passwordHash = await hashPassword(password);
    }

    await user.save();

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui pengguna" };
  }
}

/**
 * Delete user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} Object with success status or error
 */
async function deleteUser(id) {
  try {
    if (!db.sequelize || !db.User) {
      return { success: false, error: "Database belum dikonfigurasi" };
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan" };
    }

    await user.destroy();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  hashPassword,
};
