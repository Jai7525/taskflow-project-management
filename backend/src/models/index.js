const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const ActivityLog = require('./ActivityLog');

// Define Associations

// User owns Tasks. Deleting a user cascades and removes their tasks.
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE'
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Tasks generate ActivityLog entries. When a task is deleted, log entries are preserved
// (taskId is set to NULL) so audit history remains visible even after task removal.
Task.hasMany(ActivityLog, {
  foreignKey: 'taskId',
  as: 'activityLogs',
  onDelete: 'SET NULL'
});
ActivityLog.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task'
});

// User <-> ActivityLog (One-to-Many)
User.hasMany(ActivityLog, {
  foreignKey: 'userId',
  as: 'activityLogs',
  onDelete: 'CASCADE'
});
ActivityLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Task,
  ActivityLog
};
