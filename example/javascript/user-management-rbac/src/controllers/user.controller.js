const userService = require("../services/user.service");

/**
 * Get all users (API endpoint)
 */
async function getUsers(req, res) {
  const result = await userService.getAllUsers();

  if (!result.success) {
    return res.status(503).json({ error: result.error });
  }

  res.json(result.users);
}

/**
 * Create new user (API endpoint)
 */
async function createUser(req, res) {
  const { name, email, role, password } = req.body || {};

  const result = await userService.createUser({
    name,
    email,
    role,
    password,
  });

  if (!result.success) {
    const statusCode = result.error === "Data tidak lengkap" ? 400 : 500;
    return res.status(statusCode).json({ error: result.error });
  }

  res.status(201).json(result.user);
}

/**
 * Update existing user (API endpoint)
 */
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, password } = req.body || {};

  const result = await userService.updateUser(id, {
    name,
    email,
    role,
    password,
  });

  if (!result.success) {
    const statusCode = result.error === "Pengguna tidak ditemukan" ? 404 : 500;
    return res.status(statusCode).json({ error: result.error });
  }

  res.json(result.user);
}

/**
 * Delete user (API endpoint)
 */
async function deleteUser(req, res) {
  const { id } = req.params;

  const result = await userService.deleteUser(id);

  if (!result.success) {
    const statusCode = result.error === "Pengguna tidak ditemukan" ? 404 : 500;
    return res.status(statusCode).json({ error: result.error });
  }

  res.json({ ok: true });
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
