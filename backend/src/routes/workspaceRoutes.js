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

// GET /api/workspace/statistics - Get task metric count aggregates
router.get('/statistics', workspaceController.getStatistics);

// GET /api/workspace/activity - Get the 10 most recent activity logs
router.get('/activity', workspaceController.getRecentActivity);

module.exports = router;
