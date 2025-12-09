const React = require('react');
const { useState, useEffect } = require('react');
const { useRBAC } = require('./RBACContext');

function Users() {
  const rbac = useRBAC();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'viewer', password: '' });

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers).catch(() => setUsers([]));
  }, []);

  const resetForm = () => setForm({ id: null, name: '', email: '', role: 'viewer' });

  const submit = async () => {
    if (!rbac.can('user:create') && form.id === null) return;
    if (!rbac.can('user:update') && form.id !== null) return;
    if (!form.name.trim() || !form.email.trim()) return;
    if (form.id === null) {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), role: form.role, password: form.password }) });
      const created = await res.json();
      if (created && created.id) setUsers([created, ...users]);
    } else {
      const res = await fetch(`/api/users/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), role: form.role, password: form.password || undefined }) });
      const updated = await res.json();
      if (updated && updated.id) setUsers(users.map(u => u.id === updated.id ? updated : u));
    }
    resetForm();
  };

  const edit = (u) => {
    setForm({ id: u.id, name: u.name, email: u.email, role: u.role });
  };

  const remove = async (id) => {
    if (!rbac.can('user:delete')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="users-box">
      <div className="users-header">
        <h2 className="users-title">Manajemen Pengguna</h2>
        <p className="users-subtitle">Buat, ubah, dan kelola peran.</p>
      </div>
      <div className="users-form">
        <input className="input" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder={form.id === null ? 'Password' : 'Password (opsional)'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
        <button className={form.id === null ? 'btn btn-primary' : 'btn btn-secondary'} onClick={submit} disabled={(form.id === null && !rbac.can('user:create')) || (form.id !== null && !rbac.can('user:update'))}>{form.id === null ? 'Tambah' : 'Simpan'}</button>
        {form.id !== null && (
          <button className="btn" onClick={resetForm}>Batal</button>
        )}
      </div>

      <div className="users-list">
        {users.length === 0 ? (
          <p className="empty">Belum ada pengguna</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={u.role === 'admin' ? 'badge admin' : u.role === 'manager' ? 'badge manager' : 'badge viewer'}>{u.role}</span></td>
                  <td className="actions">
                    <button className="btn" onClick={() => edit(u)} disabled={!rbac.can('user:update')}>Ubah</button>
                    <button className="btn btn-danger" onClick={() => remove(u.id)} disabled={!rbac.can('user:delete')}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

module.exports = Users;
