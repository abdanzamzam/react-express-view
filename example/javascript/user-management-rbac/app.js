const express = require('express');
const path = require('path');
const reactExpressView = require('react-express-view');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('./models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ROLE_PERMS = {
  admin: ['user:create','user:update','user:delete','role:assign','role:view'],
  manager: ['user:create','user:update','role:view'],
  viewer: ['role:view']
};

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactExpressView.createEngine());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.auth;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    } catch {
      req.user = null;
    }
  }
  next();
}
app.use(authMiddleware);

function can(role, permission) {
  return (ROLE_PERMS[role] || []).includes(permission);
}

app.get('/', (req, res) => {
  const user = req.user || null;
  res.render('Home', { title: 'User Management (RBAC)', message: 'Kelola pengguna, peran, dan izin.', user });
});

app.get('/login', (req, res) => {
  res.render('Login', { title: 'Masuk', message: 'Silakan masuk untuk melanjutkan.' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    if (!db.sequelize || !db.User) throw new Error('DB not configured');
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(401).render('Login', { title: 'Masuk', message: 'Email atau password salah.' });
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).render('Login', { title: 'Masuk', message: 'Email atau password salah.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
    res.redirect('/');
  } catch (e) {
    res.status(500).render('Login', { title: 'Masuk', message: 'Terjadi kesalahan. Konfigurasi database diperlukan.' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});

app.get('/api/users', async (req, res) => {
  try {
    if (!db.sequelize || !db.User) return res.status(503).json({ error: 'Database belum dikonfigurasi' });
    const items = await db.User.findAll({ attributes: ['id','name','email','role'], order: [['id','DESC']] });
    res.json(items);
  } catch (e) { res.status(500).json({ error: 'Gagal mengambil data' }); }
});

app.post('/api/users', async (req, res) => {
  const actor = req.user;
  if (!actor || !can(actor.role, 'user:create')) return res.status(403).json({ error: 'Tidak diizinkan' });
  try {
    if (!db.sequelize || !db.User) return res.status(503).json({ error: 'Database belum dikonfigurasi' });
    const { name, email, role, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Data tidak lengkap' });
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await db.User.create({ name, email, role: role || 'viewer', passwordHash });
    res.status(201).json({ id: created.id, name: created.name, email: created.email, role: created.role });
  } catch (e) { res.status(500).json({ error: 'Gagal membuat pengguna' }); }
});

app.put('/api/users/:id', async (req, res) => {
  const actor = req.user;
  if (!actor || !can(actor.role, 'user:update')) return res.status(403).json({ error: 'Tidak diizinkan' });
  try {
    if (!db.sequelize || !db.User) return res.status(503).json({ error: 'Database belum dikonfigurasi' });
    const { name, email, role, password } = req.body || {};
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { res.status(500).json({ error: 'Gagal memperbarui pengguna' }); }
});

app.delete('/api/users/:id', async (req, res) => {
  const actor = req.user;
  if (!actor || !can(actor.role, 'user:delete')) return res.status(403).json({ error: 'Tidak diizinkan' });
  try {
    if (!db.sequelize || !db.User) return res.status(503).json({ error: 'Database belum dikonfigurasi' });
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    await user.destroy();
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Gagal menghapus pengguna' }); }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
