# React Express View

React Express View is a template engine for Express that allows rendering React components as client-side views. It supports both JavaScript (`.jsx`) and TypeScript (`.tsx`).

For example projects, check the `example` directory:

- [JavaScript Example](https://github.com/abdanzamzam/react-express-view/tree/main/example/counter-app)
- [TypeScript Example](https://github.com/abdanzamzam/react-express-view/tree/main/example/typescript-app)

## Installation

```sh
npm install react-express-view
```

## Usage

### 1. Import and Configuration

To ensure compatibility and prevent "Invalid Hook Call" errors (due to multiple React instances), you should inject your application's `React` and `ReactDOMServer` instances into the engine.

#### JavaScript

```javascript
const express = require("express");
const path = require("path");
const reactExpressView = require("react-express-view");

const app = express();

// Configure the engine and views folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jsx");
app.engine("jsx", reactExpressView.createEngine());

// Serve static files for client-side JavaScript
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("Home", {
    title: "Home Page",
    message: "Welcome to the Home Page!",
  });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
```

#### TypeScript

```typescript
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
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("Home", {
    title: "TypeScript App",
    message: "Welcome to the TypeScript Example!",
  });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
```

### 2. Creating a React Component

Inside the `views` folder, create a file `Home.jsx` (or `Home.tsx`):

```jsx
const React = require("react");
const { useState } = require("react");

function Home(props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

module.exports = Home; // or export default Home;
```

### 3. Client-side Hydration

To make the React components interactive on the client side, you need a client entry point.

Inside the `client` folder, create `index.jsx` (or `index.tsx`):

```jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";

// Dynamic import to support CommonJS and ES Modules
// Automatically register all components in the views directory
const requireComponent = require.context(
  "../views",
  true,
  /\.(js|jsx|ts|tsx)$/
);
const components = {};

requireComponent.keys().forEach((fileName) => {
  // Extract component name from filename (e.g., ./Home.jsx -> Home)
  const componentName = fileName
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");

  // Handle default exports and named exports
  components[componentName] =
    requireComponent(fileName).default || requireComponent(fileName);
});

// Retrieve the component name sent from the server
const componentName = window.__INITIAL_COMPONENT__;
const Component = components[componentName];

if (!Component) {
  throw new Error(`Component "${componentName}" not found.`);
}

// Target root element
const rootElement = document.getElementById("root");

// Perform rehydration
if (rootElement) {
  hydrateRoot(rootElement, <Component {...window.__INITIAL_PROPS__} />);
}
```

### 4. Bundling

You will need a bundler like Webpack to compile your client-side code.

#### `.babelrc` or `babel.config.json`

Ensure you have the necessary presets:

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

> Note: `@babel/preset-typescript` is only required if you are using TypeScript.

## Configuration

`createEngine(options)` accepts the following options:

- `doctype`: Defines the doctype for the output HTML (default: `<!DOCTYPE html>`).
- `transformViews`: Enables runtime transpilation of views using `@babel/register` (default: `true`).
- `React`: Pass your application's React instance (fixes Hook errors).
- `ReactDOMServer`: Pass your application's ReactDOMServer instance.
- `babel`: Custom Babel configuration object passed to `@babel/register`.

## License

This project is licensed under the MIT License.
