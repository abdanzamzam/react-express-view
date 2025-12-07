const React = require('react');
const RBACApp = require('./components/RBACApp');

function Home(props) {
  return (
    <>
      <link rel="stylesheet" href="/css/home.css" />
      <link rel="stylesheet" href="/css/rbac.css" />
      <div className="home-page">
        <div className="home-card">
          <div className="home-header">
            <h1 className="home-title">{props.title}</h1>
            <p className="home-subtitle">{props.message}</p>
          </div>
          <div className="rbac-topbar">
            {props.user ? (
              <div className="topbar-row">
                <span className="topbar-user">{props.user.name} ({props.user.role})</span>
                <form method="post" action="/logout"><button className="btn">Keluar</button></form>
              </div>
            ) : (
              <a className="btn" href="/login">Masuk</a>
            )}
          </div>
          <RBACApp initialRole={props.user ? props.user.role : 'viewer'} />
        </div>
      </div>
    </>
  );
}

module.exports = Home;
