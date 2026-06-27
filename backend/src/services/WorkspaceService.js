/**
 * Workspace Service
 *
 * Coordinates workspace statistics
 * and aggregates audit activity feeds.
 */

const { Op, fn, col, literal } = require('sequelize');
const { Task, ActivityLog, User } = require('../models');

class WorkspaceService {
  /**
   * Aggregates task count statistics by workflow status.
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
   * Retrieves the latest 10 activity logs for the dashboard feed.
   */
  async getRecentActivity(userId) {
    const activityLogs = await ActivityLog.findAll({
      where: { userId },
      order: [['created_at', 'DESC']], // Return newest activities first for the dashboard feed.
      limit: 10,
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          // Keep join optional (left outer join) since deleted tasks remain in activity history.
          required: false
        }
      ]
    });

    return activityLogs;
  }
}

module.exports = new WorkspaceService();
