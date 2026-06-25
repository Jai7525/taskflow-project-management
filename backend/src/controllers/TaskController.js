const taskService = require('../services/TaskService');

class TaskController {
  /**
   * Create a new task
   */
  async createTask(req, res, next) {
    try {
      const userId = req.user.id;
      const task = await taskService.createTask(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks for the logged in user
   */
  async getAllTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await taskService.getAllTasks(userId, req.query);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await taskService.getTaskById(userId, taskId);

      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update task fields
   */
  async updateTask(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await taskService.updateTask(userId, taskId, req.body);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a task as completed
   */
  async completeTask(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await taskService.completeTask(userId, taskId);

      res.status(200).json({
        success: true,
        message: 'Task marked as completed',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      await taskService.deleteTask(userId, taskId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
