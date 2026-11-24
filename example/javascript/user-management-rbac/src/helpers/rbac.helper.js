const { ROLE_PERMS } = require("../config/constants");

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (admin, manager, viewer)
 * @param {string} permission - Permission to check (e.g., "user:create")
 * @returns {boolean} True if role has permission
 */
function can(role, permission) {
  return (ROLE_PERMS[role] || []).includes(permission);
}

/**
 * Check if a user object has a specific permission
 * @param {Object} user - User object with role property
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  return can(user.role, permission);
}

/**
 * Get all permissions for a specific role
 * @param {string} role - User role
 * @returns {Array<string>} Array of permissions
 */
function getRolePermissions(role) {
  return ROLE_PERMS[role] || [];
}

module.exports = {
  can,
  hasPermission,
  getRolePermissions,
};
