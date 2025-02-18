# React Express View

React Express View is a template engine for Express that allows rendering React components as server-side views.

## Installation

```sh
npm install react-express-view
```

## Usage

Here is an example of how to use `react-express-view` in an Express application.

### 1. Import and Configuration

```javascript
const express = require('express');
const path = require('path');
const reactExpressView = require('react-express-view');

const app = express();

// Configure the engine and views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactExpressView.createEngine());

// Serve static files for client-side JavaScript
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('Home', { title: 'Home Page', message: 'Welcome to the Home Page!' });
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
```

### 2. Creating a React Component

Inside the `views` folder, create a file `Home.jsx`:

```jsx
const React = require('react');

const Home = (props) => {
    return (
        <html>
            <head>
                <title>{props.title}</title>
            </head>
            <body>
                <h1>{props.message}</h1>
            </body>
        </html>
    );
};

module.exports = Home;
```

### 3. Client-side Hydration

Inside the `client` folder, create a file `index.jsx`:

```jsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client'; // React 18

// Dynamic import to support CommonJS and ES Modules
const components = {
    Home: require('../views/Home'),
};

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
```

### 4. Webpack Configuration

In the project root, create a file `webpack.config.js`:

```javascript
const path = require('path');

module.exports = {
    entry: './client/index.jsx', // Entry point for React client-side
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js', // Output file
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
```

## Configuration

`react-express-view` provides several configurable options:

- `doctype`: Defines the doctype for the output HTML (default: `<!DOCTYPE html>`).
- `transformViews`: Enables `@babel/register` to transpile JSX at runtime.

## License

This project is licensed under the MIT License.
