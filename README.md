# React Express View

[![npm version](https://img.shields.io/npm/v/react-express-view)](https://www.npmjs.com/package/react-express-view)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-express-view)](https://bundlephobia.com/package/react-express-view)
[![TypeScript](https://img.shields.io/badge/TypeScript-✅-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> A template engine for Express that renders React components as server-side views with client hydration. Supports **JSX** and **TSX**.

---

## Features

- ✅ **Server-side rendering** — render React components to HTML on the server
- ✅ **Client hydration** — interactive components after page load
- ✅ **JSX & TSX** — supports JavaScript and TypeScript
- ✅ **Hot reload** — auto-clear cache in development
- ✅ **Customizable** — inject your own React instance, scripts, doctype
- ✅ **Error resilience** — graceful error pages for dev and production
- ✅ **XSS protection** — safe prop serialization
- ✅ **TypeScript** — type definitions included
- ✅ **Zero unnecessary deps** — only `@babel/register`

## Install

```sh
npm install react-express-view
```

### Peer Dependencies

You need to install these alongside:

```sh
npm install react react-dom @babel/preset-env @babel/preset-react
# Only for TypeScript:
npm install @babel/preset-typescript
```

---

## Quick Start

### 1. Create your Express app

```js
const express = require("express");
const path = require("path");
const { createEngine } = require("react-express-view");

const app = express();

// Configure the engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jsx");
app.engine("jsx", createEngine());

// Serve static files for client-side JS
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("Home", { title: "Home", message: "Welcome!" });
});

app.listen(3000);
```

### 2. Create a view component

```jsx
// views/Home.jsx
const React = require("react");

function Home(props) {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

module.exports = Home;
```

### 3. Client-side hydration

```jsx
// client/index.jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";

const Component = require("../views/Home.jsx").default || require("../views/Home.jsx");

hydrateRoot(
  document.getElementById("root"),
  <Component {...window.__INITIAL_PROPS__} />
);
```

### 4. Bundle with Webpack

```sh
npx webpack --entry ./client/index.jsx --output ./public/js/bundle.js
```

---

## Configuration

### `createEngine(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `doctype` | `string` | `<!DOCTYPE html>` | HTML doctype |
| `transformViews` | `boolean` | `true` | Enable runtime Babel transpilation |
| `babel` | `object` | — | Custom Babel config passed to `@babel/register` |
| `React` | `object` | — | Inject your app's React instance (prevents Hook errors) |
| `ReactDOMServer` | `object` | — | Inject your app's ReactDOMServer instance |
| `clientScripts` | `string[]` | `["/js/bundle.js"]` | Client-side script URLs |

### TypeScript

```ts
import express from "express";
import path from "path";
import { createEngine } from "react-express-view";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "tsx");
app.engine(
  "tsx",
  createEngine({
    transformViews: true,
    React: require("react"),
    ReactDOMServer: require("react-dom/server"),
    clientScripts: ["/js/vendor.js", "/js/app.js"],
  })
);
```

---

## Production Checklist

1. **Bundle client code** — use Webpack/Vite to compile `client/` → `public/js/bundle.js`
2. **Pre-transpile views** — for production, consider pre-building instead of runtime Babel
3. **Disable `transformViews`** in production if you pre-build:

```js
createEngine({
  transformViews: false,
  React: require("react"),
  ReactDOMServer: require("react-dom/server"),
})
```

---

## Error Handling

| Environment | Error output |
|-------------|--------------|
| `development` | Red error page with full stack trace |
| `production` | User-friendly "Something went wrong" page |

---

## API

```ts
import { createEngine, EngineOptions, RenderFile } from "react-express-view";

// Type definitions
interface EngineOptions {
  doctype?: string;
  transformViews?: boolean;
  babel?: Record<string, any>;
  React?: typeof React;
  ReactDOMServer?: any;
  clientScripts?: string[];
}

type RenderFile = (
  filename: string,
  options: Record<string, any>,
  cb: (err: Error | null, html?: string) => void
) => void;
```

---

## License

MIT © [Abdan Zam Zam Ramadhan](https://github.com/abdanzamzam)
