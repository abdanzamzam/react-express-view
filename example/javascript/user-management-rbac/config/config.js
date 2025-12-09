require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || null,
    dialect: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    database: process.env.PGDATABASE || 'rbac_dev',
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || null,
    logging: false
  },
  test: {
    url: process.env.DATABASE_URL || null,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
};
