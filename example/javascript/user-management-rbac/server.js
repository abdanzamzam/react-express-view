require("dotenv").config();
const { configureApp } = require("./src/config/app");
const { authMiddleware } = require("./src/middleware/auth.middleware");
const routes = require("./src/routes");
const { PORT } = require("./src/config/constants");

// Configure Express app
const app = configureApp();

// Apply global authentication middleware
app.use(authMiddleware);

// Mount all routes
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
