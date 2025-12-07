import React from 'react';
import { hydrateRoot } from 'react-dom/client'; // React 18

// Dynamic import to support CommonJS and ES Modules
// Automatically register all components in the views directory
const requireComponent = require.context('../views', true, /\.(js|jsx)$/);
const components = {};

requireComponent.keys().forEach((fileName) => {
    // Extract component name from filename (e.g., ./Home.jsx -> Home)
    const componentName = fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '');
    
    components[componentName] = requireComponent(fileName);
});

// Retrieve the component name sent from the server
const componentName = window.__INITIAL_COMPONENT__;
const Component = components[componentName]?.default || components[componentName];

if (!Component) {
    throw new Error(`Component "${componentName}" not found.`);
}

// Target root element
const rootElement = document.getElementById('root');

// Perform rehydration
hydrateRoot(
    rootElement,
    <Component {...window.__INITIAL_PROPS__} />
);