/**
 * Show home page
 */
function showHomePage(req, res) {
  const user = req.user || null;

  res.render("Home", {
    title: "User Management (RBAC)",
    message: "Kelola pengguna, peran, dan izin.",
    user,
  });
}

module.exports = {
  showHomePage,
};
