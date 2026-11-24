const authService = require("../services/auth.service");

/**
 * Show login page
 */
function showLoginPage(req, res) {
  res.render("Login", {
    title: "Masuk",
    message: "Silakan masuk untuk melanjutkan.",
  });
}

/**
 * Handle login form submission
 */
async function handleLogin(req, res) {
  const { email, password } = req.body || {};

  const result = await authService.login(email, password);

  if (!result.success) {
    return res.status(401).render("Login", {
      title: "Masuk",
      message: result.error,
    });
  }

  // Set auth cookie
  res.cookie("auth", result.token, { httpOnly: true, sameSite: "lax" });
  res.redirect("/");
}

/**
 * Handle logout
 */
function handleLogout(req, res) {
  res.clearCookie("auth");
  res.redirect("/login");
}

module.exports = {
  showLoginPage,
  handleLogin,
  handleLogout,
};
