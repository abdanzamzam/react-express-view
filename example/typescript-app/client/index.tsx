import React from "react";
import { hydrateRoot } from "react-dom/client";

declare global {
  interface Window {
    __INITIAL_COMPONENT__: string;
    __INITIAL_PROPS__: any;
  }
}

// Dynamic import to support CommonJS and ES Modules
// Automatically register all components in the views directory
const requireComponent = require.context(
  "../views",
  true,
  /\.(js|jsx|ts|tsx)$/
);
const components: { [key: string]: any } = {};

requireComponent.keys().forEach((fileName: string) => {
  // Extract component name from filename (e.g., ./Home.tsx -> Home)
  const componentName = fileName
    .split("/")
    .pop()
    ?.replace(/\.\w+$/, "");

  if (componentName) {
    components[componentName] = requireComponent(fileName);
  }
});

// Retrieve the component name sent from the server
const componentName = window.__INITIAL_COMPONENT__;
const Component =
  components[componentName]?.default || components[componentName];

if (!Component) {
  throw new Error(`Component "${componentName}" not found.`);
}

// Target root element
const rootElement = document.getElementById("root");

if (rootElement) {
  // Perform rehydration
  hydrateRoot(rootElement, <Component {...window.__INITIAL_PROPS__} />);
}
