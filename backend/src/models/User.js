const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * User Database Model.
 *
 * Represents a user account inside TaskFlow.
 * Handles credential checks and workspace ownership parameters.
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
