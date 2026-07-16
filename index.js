const path = require("path");

const DEFAULT_OPTIONS = {
  doctype: "<!DOCTYPE html>",
  transformViews: true,
  clientScripts: ["/js/bundle.js"],
  babel: {
    presets: [
      "@babel/preset-react",
      ["@babel/preset-env", { targets: { node: "current" } }],
    ],
  },
};

/**
 * Escape special regex characters in a string (replaces lodash.escaperegexp).
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Create an Express template engine that renders React components.
 *
 * @param {import('./index').EngineOptions} [engineOptions]
 * @returns {import('./index').RenderFile}
 */
function createEngine(engineOptions) {
  let registered = false;
  let moduleDetectRegEx;
  let React, ReactDOMServer;

  const opts = Object.assign({}, DEFAULT_OPTIONS, engineOptions || {});

  // Unique ID counter for inline script safety
  let scriptIdCounter = 0;

  function getReact() {
    if (!React) React = opts.React || require("react");
    return React;
  }

  function getReactDOMServer() {
    if (!ReactDOMServer)
      ReactDOMServer = opts.ReactDOMServer || require("react-dom/server");
    return ReactDOMServer;
  }

  /**
   * Include TypeScript preset only if the view file is .tsx/.ts
   */
  function resolveBabelPresets(filename) {
    const isTS = /\.tsx?$/i.test(filename);
    const presets = [].concat(opts.babel?.presets || []);
    if (isTS) {
      // Insert TypeScript preset after react preset, before env
      const tsIdx = presets.findIndex(
        (p) =>
          (Array.isArray(p) && p[0] === "@babel/preset-typescript") ||
          p === "@babel/preset-typescript"
      );
      if (tsIdx === -1) {
        presets.push("@babel/preset-typescript");
      }
    }
    return presets;
  }

  /**
   * Render a React component as an HTML string.
   */
  function renderFile(filename, options, cb) {
    try {
      // Build moduleDetectRegEx for cache clearing
      if (!moduleDetectRegEx) {
        const viewPaths = [].concat(options.settings.views || []);
        if (viewPaths.length > 0) {
          moduleDetectRegEx = new RegExp(
            viewPaths
              .map((vp) => "^" + escapeRegex(path.resolve(vp)))
              .join("|")
          );
        } else {
          moduleDetectRegEx = /^$/;
        }
      }

      // Register Babel for runtime transpilation (development only in production)
      if (opts.transformViews && !registered) {
        const onlyPaths = [].concat(options.settings.views || []).map((vp) => path.resolve(vp));
        require("@babel/register")(
          Object.assign(
            {
              only: onlyPaths,
              extensions: [".js", ".jsx", ".ts", ".tsx"],
              presets: resolveBabelPresets(filename),
            },
            opts.babel
          )
        );
        registered = true;
      }

      const _React = getReact();
      const _ReactDOMServer = getReactDOMServer();

      // Load component
      let component = require(filename);
      component = component.default || component;

      if (typeof component !== "function") {
        throw new Error(
          `React Express View: "${filename}" does not export a valid component. ` +
            `Make sure you use "module.exports" or "export default".`
        );
      }

      // Render to string
      const staticMarkup = _ReactDOMServer.renderToString(
        _React.createElement(component, options)
      );

      // Serialize props safely
      const safeComponentName = path
        .basename(filename)
        .replace(/\.(js|jsx|ts|tsx)$/, "");
      const propsJSON = JSON.stringify(options).replace(/</g, "\\u003c");

      // Build inline data script
      const stateId = `__REV_STATE_${++scriptIdCounter}__`;

      const inlineScript = `window.__INITIAL_COMPONENT__="${safeComponentName}";window.__INITIAL_PROPS__=${propsJSON};`;

      // Build script tags
      const scripts = (opts.clientScripts || ["/js/bundle.js"])
        .map((src) => `\n            <script src="${src}"></script>`)
        .join("");

      const html = `${opts.doctype}\n
            <div id="root">${staticMarkup}</div>
            <script>${inlineScript}</script>${scripts}
            `;

      cb(null, html);
    } catch (e) {
      // Graceful error rendering
      if (options.settings.env === "development") {
        cb(
          null,
          `${opts.doctype}\n<html><body><pre style="color:red;font-size:14px;padding:20px;"><strong>React Express View Error:</strong>\n${e.stack}</pre></body></html>`
        );
      } else {
        cb(
          null,
          `${opts.doctype}\n<html><body><div style="padding:40px;text-align:center;"><h1>Something went wrong</h1><p>Please try again later.</p></div></body></html>`
        );
      }
    } finally {
      // In development, clear the view module cache for hot reload
      if (options.settings.env === "development" && moduleDetectRegEx) {
        Object.keys(require.cache).forEach((module) => {
          if (
            moduleDetectRegEx.test(require.cache[module]?.filename || "")
          ) {
            delete require.cache[module];
          }
        });
      }
    }
  }

  return renderFile;
}

module.exports = { createEngine };
