import React from 'react';
import { hydrateRoot } from 'react-dom/client';

const requireComponent = require.context('../views', true, /\.(js|jsx)$/);
const components = {};

requireComponent.keys().forEach((fileName) => {
  const componentName = fileName.split('/').pop().replace(/\.(\w+)$/, '');
  components[componentName] = requireComponent(fileName);
});

const componentName = window.__INITIAL_COMPONENT__;
const Component = components[componentName]?.default || components[componentName];

if (!Component) {
  throw new Error(`Component "${componentName}" not found.`);
}

const rootElement = document.getElementById('root');

hydrateRoot(rootElement, <Component {...window.__INITIAL_PROPS__} />);
