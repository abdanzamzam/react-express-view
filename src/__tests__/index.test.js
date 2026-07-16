const path = require("path");
const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");

const { createEngine } = require("../../index");

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeOptions(overrides = {}) {
  const base = {
    settings: {
      views: [path.resolve(__dirname, "../fixtures")],
      env: "test",
    },
    title: "Test Page",
    message: "Hello Test",
  };
  return { ...base, ...overrides };
}

function renderPromise(filename, options, engineOpts = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      transformViews: true,
      babel: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          ["@babel/preset-env", { targets: { node: "current" } }],
        ],
      },
      ...engineOpts,
    };

    if (!opts.React && !opts.ReactDOMServer) {
      opts.React = require("react");
      opts.ReactDOMServer = require("react-dom/server");
    }

    const engine = createEngine(opts);

    engine(path.resolve(__dirname, "../fixtures", filename), options, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("react-express-view", () => {
  describe("createEngine()", () => {
    it("returns a function", () => {
      const engine = createEngine();
      assert.equal(typeof engine, "function");
    });

    it("returns different instances each call", () => {
      const a = createEngine();
      const b = createEngine();
      assert.notEqual(a, b);
    });

    it("merges custom options", () => {
      const engine = createEngine({ doctype: "<!DOCTYPE custom>" });
      assert.equal(typeof engine, "function");
    });
  });

  describe("renderFile", () => {
    it("renders JSX component to HTML string", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions({
        title: "Hello", message: "World",
      }));

      assert.ok(html);
      assert.ok(html.includes("<!DOCTYPE html>"));
      assert.ok(html.includes("<div id=\"root\">"));
      assert.ok(html.includes("Hello"));
      assert.ok(html.includes("World"));
      assert.ok(html.includes("__INITIAL_COMPONENT__"));
      assert.ok(html.includes("__INITIAL_PROPS__"));
    });

    it("includes default bundle.js script", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions());
      assert.ok(html.includes('bundle.js'));
    });

    it("includes custom clientScripts", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions(), {
        clientScripts: ["/js/app.js", "/js/vendor.js"],
      });
      assert.ok(html.includes("/js/app.js"));
      assert.ok(html.includes("/js/vendor.js"));
    });

    it("passes props to the component", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions({
        title: "Custom Title",
        message: "Custom Message",
      }));

      assert.ok(html.includes("Custom Title"));
      assert.ok(html.includes("Custom Message"));
    });

    it("uses custom doctype", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions(), {
        doctype: "<?xml version=\"1.0\"?>",
      });
      assert.ok(html.includes("<?xml"));
    });

    it("serializes __INITIAL_PROPS__ safely", async () => {
      const html = await renderPromise("Hello.jsx", makeOptions({
        user: "<script>alert('xss')</script>",
      }));
      // Should be escaped as \u003c not literal <
      assert.ok(!html.includes("<script>alert"));
    });

    it("renders component with React and ReactDOMServer injection", async () => {
      const React = require("react");
      const ReactDOMServer = require("react-dom/server");
      const html = await renderPromise("Hello.jsx", makeOptions(), {
        React,
        ReactDOMServer,
      });
      assert.ok(html.includes("Hello Test"));
    });
  });

  describe("error handling", () => {
    it("shows error page in development mode", async () => {
      const html = await renderPromise("NotFound.jsx", makeOptions({
        settings: { views: [path.resolve(__dirname, "../fixtures")], env: "development" },
      }));
      assert.ok(html.includes("React Express View Error"));
    });

    it("shows generic error in production mode", async () => {
      const html = await renderPromise("NotFound.jsx", makeOptions({
        settings: { views: [path.resolve(__dirname, "../fixtures")], env: "production" },
      }));
      assert.ok(html.includes("Something went wrong"));
    });

    it("invalid component produces error HTML in dev", async () => {
      const React = require("react");
      const ReactDOMServer = require("react-dom/server");
      const html = await renderPromise("InvalidExport.jsx", makeOptions({
        settings: { views: [path.resolve(__dirname, "../fixtures")], env: "development" },
      }), { React, ReactDOMServer });
      assert.ok(html);
      assert.ok(html.includes("React Express View Error"));
    });

    it("invalid component produces generic error in prod", async () => {
      const React = require("react");
      const ReactDOMServer = require("react-dom/server");
      const html = await renderPromise("InvalidExport.jsx", makeOptions({
        settings: { views: [path.resolve(__dirname, "../fixtures")], env: "production" },
      }), { React, ReactDOMServer });
      assert.ok(html);
      assert.ok(html.includes("Something went wrong"));
    });
  });
});
