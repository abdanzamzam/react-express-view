const React = require('react');
const { createContext, useContext, useState, useMemo, useEffect } = require('react');

const RBACContext = createContext(null);

const roles = {
  admin: ['user:create','user:update','user:delete','role:assign','role:view'],
  manager: ['user:create','user:update','role:view'],
  viewer: ['role:view']
};

function RBACProvider(props) {
  const [role, setRole] = useState(props.initialRole || 'admin');

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' && window.localStorage.getItem('rbac_role');
      if (saved) setRole(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('rbac_role', role);
    } catch {}
  }, [role]);

  const value = useMemo(() => ({
    role,
    setRole,
    can: (permission) => (roles[role] || []).includes(permission)
  }), [role]);

  return React.createElement(RBACContext.Provider, { value }, props.children);
}

function useRBAC() {
  return useContext(RBACContext);
}

module.exports = { RBACProvider, useRBAC };
