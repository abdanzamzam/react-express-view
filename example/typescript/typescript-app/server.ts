import express from 'express';
import path from 'path';
import { createEngine } from 'react-express-view';

const app = express();

// Configure the engine and views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'tsx');
app.engine(
    'tsx',
    createEngine({
        transformViews: true,
        React: require('react'),
        ReactDOMServer: require('react-dom/server'),
    })
);

// Serve static files for client-side JavaScript
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('Home', {
        title: 'TypeScript App',
        message: 'Welcome to the TypeScript Example!',
    });
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
