const { hasPermission } = require("../helpers/rbac.helper");

/**
 * Middleware factory to check if user has required permission
 * @param {string} permission - Required permission (e.g., "user:create")
 * @returns {Function} Express middleware function
 */
function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Tidak terautentikasi" });
    }

    if (!hasPermission(user, permission)) {
      return res.status(403).json({ error: "Tidak diizinkan" });
    }

    next();
  };
}

module.exports = {
  requirePermission,
};
