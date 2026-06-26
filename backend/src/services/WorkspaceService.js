const { Op, fn, col, literal } = require('sequelize');
const { Task, ActivityLog, User } = require('../models');

class WorkspaceService {
  /**
   * Return aggregate task statistics for the logged-in user:
   * total tasks, and breakdown by each status value.
   */
  async getStatistics(userId) {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.count({ where: { userId } }),
      Task.count({ where: { userId, status: 'Pending' } }),
      Task.count({ where: { userId, status: 'In Progress' } }),
      Task.count({ where: { userId, status: 'Completed' } })
    ]);

    return {
      total,
      pending,
      inProgress,
      completed
    };
  }

  /**
   * Return recent activity logs for the logged-in user,
   * including the related task title for display context.
   * Limited to the most recent 10 actions.
   */
  async getRecentActivity(userId) {
    const activityLogs = await ActivityLog.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      limit: 10,
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          // Task may be null if it was deleted (SET NULL constraint)
          required: false
        }
      ]
    });

    return activityLogs;
  }
}

module.exports = new WorkspaceService();
