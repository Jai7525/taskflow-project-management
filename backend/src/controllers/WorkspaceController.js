const workspaceService = require('../services/WorkspaceService');

class WorkspaceController {
  /**
   * Return task count statistics for the logged-in user
   */
  async getStatistics(req, res, next) {
    try {
      const userId = req.user.id;
      const statistics = await workspaceService.getStatistics(userId);

      res.status(200).json({
        success: true,
        message: 'Workspace statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Return the 10 most recent activity logs for the logged-in user
   */
  async getRecentActivity(req, res, next) {
    try {
      const userId = req.user.id;
      const activity = await workspaceService.getRecentActivity(userId);

      res.status(200).json({
        success: true,
        message: 'Recent activity retrieved successfully',
        data: activity
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkspaceController();
