const React = require('react');
const { useRBAC } = require('./RBACContext');

function RoleSwitch() {
  const rbac = useRBAC();
  return (
    <div className="role-switch">
      <label className="role-label">Peran saat ini</label>
      <select className="role-select" value={rbac.role} onChange={(e) => rbac.setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="viewer">Viewer</option>
      </select>
      <span className={
        rbac.role === 'admin' ? 'role-badge admin' : rbac.role === 'manager' ? 'role-badge manager' : 'role-badge viewer'
      }>{rbac.role}</span>
    </div>
  );
}

module.exports = RoleSwitch;
