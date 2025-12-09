const React = require('react');
const { useRBAC } = require('./RBACContext');

function PermissionGuard(props) {
  const rbac = useRBAC();
  if (!rbac || !rbac.can(props.permission)) return null;
  return React.createElement(React.Fragment, null, props.children);
}

module.exports = PermissionGuard;
