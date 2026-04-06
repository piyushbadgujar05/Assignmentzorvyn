const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

// protect: all dashboard routes require auth
router.use(protect);

router.get('/summary', DashboardController.getSummary);
router.get('/category-breakdown', DashboardController.getCategoryBreakdown);
router.get('/trends', DashboardController.getMonthlyTrends);
router.get('/recent', DashboardController.getRecentActivity);

module.exports = router;
