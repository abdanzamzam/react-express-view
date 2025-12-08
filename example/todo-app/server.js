const express = require('express');
const path = require('path');
const reactExpressView = require('react-express-view');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactExpressView.createEngine());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('Home', { title: 'Todo Elegan', message: 'Kelola tugas harian dengan rapi dan fokus.' });
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
