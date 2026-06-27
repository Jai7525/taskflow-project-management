/**
 * Task Routes
 *
 * Exposes API endpoints for managing tasks (CRUD operations, completion, status updates).
 * Includes authentication guards and request payload validation middleware.
 */

const express = require('express');
const taskController = require('../controllers/TaskController');
const authenticateJWT = require('../middleware/authMiddleware');
const { createTaskValidator, updateTaskValidator, validateParams } = require('../validators/taskValidator');

const router = express.Router();

// Enforce authentication token checks on all task requests
router.use(authenticateJWT);

// POST /api/tasks - Create a new task (Validates title, description, status, priority, dueDate)
router.post('/', createTaskValidator, taskController.createTask);

// GET /api/tasks - List paginated tasks (Accepts page, limit, status, search, and sort parameters)
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Retrieve single task details
router.get('/:id', validateParams, taskController.getTaskById);

// PUT /api/tasks/:id - Update task properties (Validates title, description, status, priority, dueDate)
router.put('/:id', updateTaskValidator, taskController.updateTask);

// PATCH /api/tasks/:id/complete - Toggle status to Completed
router.patch('/:id/complete', validateParams, taskController.completeTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateParams, taskController.deleteTask);

module.exports = router;
