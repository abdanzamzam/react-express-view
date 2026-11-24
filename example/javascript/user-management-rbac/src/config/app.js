const express = require("express");
const path = require("path");
const reactExpressView = require("react-express-view");
const cookieParser = require("cookie-parser");

/**
 * Configure Express application
 * @returns {express.Application} Configured Express app
 */
function configureApp() {
  const app = express();

  // View engine setup
  app.set("views", path.join(__dirname, "../../views"));
  app.set("view engine", "jsx");
  app.engine(
    "jsx",
    reactExpressView.createEngine({
      transformViews: true,
      React: require("react"),
      ReactDOMServer: require("react-dom/server"),
    })
  );

  // Static files
  app.use(express.static(path.join(__dirname, "../../public")));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parser
  app.use(cookieParser());

  return app;
}

module.exports = { configureApp };
