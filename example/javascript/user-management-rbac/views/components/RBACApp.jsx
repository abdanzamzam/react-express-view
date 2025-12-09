const React = require('react');
const { RBACProvider } = require('./RBACContext');
const RoleSwitch = require('./RoleSwitch');
const Users = require('./Users');

function RBACApp(props) {
  return (
    <RBACProvider initialRole={props.initialRole}>
      <div className="rbac-app">
        <RoleSwitch />
        <Users />
      </div>
    </RBACProvider>
  );
}

module.exports = RBACApp;
