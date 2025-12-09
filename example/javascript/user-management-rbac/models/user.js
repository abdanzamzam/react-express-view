const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  if (!sequelize) return null;
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    role: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'viewer' },
    passwordHash: { type: DataTypes.STRING(200), allowNull: false }
  }, {
    tableName: 'users',
    underscored: true
  });
  return User;
};
