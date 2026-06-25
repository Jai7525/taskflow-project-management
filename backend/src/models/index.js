const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const ActivityLog = require('./ActivityLog');

// Define Associations

// User <-> Task (One-to-Many)
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE'
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Task <-> ActivityLog (One-to-Many)
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
