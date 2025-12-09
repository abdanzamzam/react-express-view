const React = require('react');
const Todo = require('./components/Todo');

function Home(props) {
  return (
    <>
      <link rel="stylesheet" href="/css/home.css" />
      <link rel="stylesheet" href="/css/todo.css" />
      <div className="home-page">
        <div className="home-card">
          <div className="home-header">
            <h1 className="home-title">{props.title}</h1>
            <p className="home-subtitle">{props.message || 'Kelola kegiatan harian Anda.'}</p>
          </div>
          <Todo />
        </div>
      </div>
    </>
  );
}

module.exports = Home;
