const express = require('express');
const workspaceController = require('../controllers/WorkspaceController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// All workspace routes require authentication
router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: Workspace statistics and activity endpoints
 */

/**
 * @swagger
 * /api/workspace/statistics:
 *   get:
 *     summary: Get task statistics for the logged-in user
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workspace statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workspace statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     pending:
 *                       type: integer
 *                       example: 5
 *                     inProgress:
 *                       type: integer
 *                       example: 4
 *                     completed:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Unauthorized — token missing, invalid, or expired
 */
router.get('/statistics', workspaceController.getStatistics);

/**
 * @swagger
 * /api/workspace/activity:
 *   get:
 *     summary: Get the 10 most recent activity logs for the logged-in user
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recent activity retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 9c1f2b3a-84d5-4b6e-a123-abc456789def
 *                       action:
 *                         type: string
 *                         example: Task Completed
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       taskId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-25T18:23:35.000Z
 *                       task:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                             example: Design Login Page
 *       401:
 *         description: Unauthorized — token missing, invalid, or expired
 */
router.get('/activity', workspaceController.getRecentActivity);

module.exports = router;
