const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * ActivityLog Database Model.
 *
 * Represents an entry in the dashboard activity feed.
 * Tracks user project actions (creation, updates, completions, and deletions).
 */
const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: true, // Activity logs can sometimes be for user actions not linked to a task, but according to rules we keep it as UUID
    field: 'task_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'activity_logs',
  timestamps: true,
  updatedAt: false, // Activity logs are immutable, no need for updatedAt
  underscored: true
});

module.exports = ActivityLog;
