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
    // Nullable so activity history survives task deletion.
    // The associated Task row may be gone, but the log entry must persist for the audit trail.
    allowNull: true,
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
  // Activity log entries are append-only — once created they are never modified.
  updatedAt: false,
  underscored: true
});

module.exports = ActivityLog;
