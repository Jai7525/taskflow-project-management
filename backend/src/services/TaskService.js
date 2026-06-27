/**
 * Task Service
 *
 * Handles task business logic,
 * dashboard synchronization,
 * and activity logging.
 */

const { Op } = require('sequelize');
const { Task, ActivityLog } = require('../models');

class TaskService {
  /**
   * Creates a new task and logs the action in the activity feed.
   */
  async createTask(userId, taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      userId
    });

    // Create activity log record to track creation in the dashboard feed.
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Created'
    });

    return task;
  }

  /**
   * Retrieves all tasks using search, filter, and pagination rules.
   */
  async getAllTasks(userId, query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { status, search, sort } = query;
    const whereConditions = { userId };

    if (status) {
      whereConditions.status = status;
    }

    // Support global multi-field search (title OR description).
    if (search) {
      const cleanSearch = search.trim();
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${cleanSearch}%` } },
        { description: { [Op.like]: `%${cleanSearch}%` } }
      ];
    }

    let order = [['created_at', 'DESC']];
    if (sort === 'oldest') {
      order = [['created_at', 'ASC']];
    } else if (sort === 'latest') {
      order = [['created_at', 'DESC']];
    }

    const { rows: tasks, count: total } = await Task.findAndCountAll({
      where: whereConditions,
      order,
      limit,
      offset
    });

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  /**
   * Retrieves a task after verifying ownership.
   */
  async getTaskById(userId, taskId) {
    const task = await Task.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  /**
   * Patches task properties and records update events.
   */
  async updateTask(userId, taskId, taskData) {
    const task = await this.getTaskById(userId, taskId);
    const { title, description, status, priority, dueDate } = taskData;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    // Create activity log record to track modifications in the dashboard feed.
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Updated'
    });

    return task;
  }

  /**
   * Marks a task status as Completed and records the event.
   */
  async completeTask(userId, taskId) {
    const task = await this.getTaskById(userId, taskId);

    task.status = 'Completed';
    await task.save();

    // Create activity log record to track completions in the dashboard feed.
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Completed'
    });

    return task;
  }

  /**
   * Deletes a task after generating a log entry.
   */
  async deleteTask(userId, taskId) {
    const task = await this.getTaskById(userId, taskId);

    // Create activity log BEFORE deleting the task to prevent orphan references.
    // The foreign key constraint onDelete SET NULL will handle reference clearing.
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Deleted'
    });

    await task.destroy();
    return true;
  }
}

module.exports = new TaskService();
