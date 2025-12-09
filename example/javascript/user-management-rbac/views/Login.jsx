const React = require('react');

function Login(props) {
  return (
    <>
      <link rel="stylesheet" href="/css/home.css" />
      <link rel="stylesheet" href="/css/auth.css" />
      <div className="home-page">
        <div className="home-card">
          <h1 className="home-title">{props.title}</h1>
          <p className="home-subtitle">{props.message}</p>
          <form className="auth-form" method="post" action="/login">
            <input className="input" type="email" name="email" placeholder="Email" required />
            <input className="input" type="password" name="password" placeholder="Password" required />
            <button className="btn btn-primary" type="submit">Masuk</button>
          </form>
        </div>
      </div>
    </>
  );
}

module.exports = Login;
