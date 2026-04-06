const DashboardService = require('../services/dashboardService');

class DashboardController {
  /**
   * @route GET /api/dashboard/summary
   * @desc Get overall financial summary
   */
  static async getSummary(req, res) {
    try {
      const summary = await DashboardService.getSummary(req.user.id);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching summary',
        error: error.message,
      });
    }
  }

  /**
   * @route GET /api/dashboard/category-breakdown
   * @desc Get expense breakdown by category
   */
  static async getCategoryBreakdown(req, res) {
    try {
      const breakdown = await DashboardService.getCategoryBreakdown(req.user.id);
      res.status(200).json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching category breakdown',
        error: error.message,
      });
    }
  }

  /**
   * @route GET /api/dashboard/trends
   * @desc Get monthly income vs expense trends
   */
  static async getMonthlyTrends(req, res) {
    try {
      const trends = await DashboardService.getMonthlyTrends(req.user.id);
      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching monthly trends',
        error: error.message,
      });
    }
  }

  /**
   * @route GET /api/dashboard/recent
   * @desc Get 5 most recent activities
   */
  static async getRecentActivity(req, res) {
    try {
      const activity = await DashboardService.getRecentActivity(req.user.id);
      res.status(200).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching recent activity',
        error: error.message,
      });
    }
  }
}

module.exports = DashboardController;
