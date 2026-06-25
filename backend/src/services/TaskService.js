const { Op } = require('sequelize');
const { Task, ActivityLog } = require('../models');

class TaskService {
  /**
   * Create a new task
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

    // Create activity log
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Created'
    });

    return task;
  }

  /**
   * Get all tasks with sorting, search, filter, and pagination
   */
  async getAllTasks(userId, query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { status, search, sort } = query;

    // Build query conditions
    const whereConditions = { userId };

    if (status) {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.title = {
        [Op.like]: `%${search}%`
      };
    }

    // Determine sort order
    let order = [['created_at', 'DESC']]; // default latest first
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
   * Get task by ID
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
   * Update task fields
   */
  async updateTask(userId, taskId, taskData) {
    const task = await this.getTaskById(userId, taskId);
    const { title, description, status, priority, dueDate } = taskData;

    // Apply updates
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    // Create activity log
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Updated'
    });

    return task;
  }

  /**
   * Mark a task status as Completed
   */
  async completeTask(userId, taskId) {
    const task = await this.getTaskById(userId, taskId);

    task.status = 'Completed';
    await task.save();

    // Create activity log
    await ActivityLog.create({
      userId,
      taskId: task.id,
      action: 'Task Completed'
    });

    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(userId, taskId) {
    const task = await this.getTaskById(userId, taskId);

    // Create activity log BEFORE deleting the task
    // The foreign key constraint onDelete SET NULL will handle reference clearing
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
