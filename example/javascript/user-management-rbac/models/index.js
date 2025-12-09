const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const cfg = config[env];

let sequelize;
try {
  if (cfg.url) {
    sequelize = new Sequelize(cfg.url, { dialect: cfg.dialect, logging: cfg.logging });
  } else {
    sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
  }
} catch (e) {
  sequelize = null;
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize);

module.exports = db;
