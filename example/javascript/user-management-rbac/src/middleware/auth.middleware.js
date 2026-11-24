const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

/**
 * Middleware to extract and verify JWT from cookies
 * Attaches user payload to req.user if token is valid
 */
function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.auth;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    } catch {
      req.user = null;
    }
  }
  next();
}

/**
 * Middleware to require authentication
 * Redirects to login page if user is not authenticated
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

/**
 * Middleware for optional authentication
 * Allows both authenticated and unauthenticated requests
 */
function optionalAuth(req, res, next) {
  // User may or may not be authenticated
  // This is just a placeholder for clarity
  next();
}

module.exports = {
  authMiddleware,
  requireAuth,
  optionalAuth,
};
