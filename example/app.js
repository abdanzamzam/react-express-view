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