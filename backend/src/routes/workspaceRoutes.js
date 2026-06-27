/**
 * Workspace Routes
 *
 * Exposes API endpoints for retrieving aggregated analytics, focus metrics,
 * and user audit activity feeds.
 */

const express = require('express');
const workspaceController = require('../controllers/WorkspaceController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication token checks on all workspace requests
router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Workspace statistics and activity feed endpoints
 */

/**
 * @swagger
 * /api/workspace/statistics:
 *   get:
 *     summary: Get task count statistics for the current user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task metric aggregates (total, pending, in-progress, completed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 24
 *                     pending:
 *                       type: integer
 *                       example: 8
 *                     inProgress:
 *                       type: integer
 *                       example: 6
 *                     completed:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/statistics', workspaceController.getStatistics);

/**
 * @swagger
 * /api/workspace/activity:
 *   get:
 *     summary: Get the 10 most recent activity log entries
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLogResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/activity', workspaceController.getRecentActivity);

module.exports = router;
