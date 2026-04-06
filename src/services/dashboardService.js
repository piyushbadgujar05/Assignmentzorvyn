const Record = require('../models/Record');
const mongoose = require('mongoose');

class DashboardService {
  // We use MongoDB Aggregation here because it's much faster than 
  // pulling all records into Node.js and looping through them.
  static async getSummary(userId) {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false, // Only count active records
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
          recordCount: '$count',
        },
      },
    ];

    const result = await Record.aggregate(pipeline);
    // Fallback object if the user has no records yet
    return result[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0, recordCount: 0 };
  }

  // Groups expenses by category. Useful for showing a pie chart on the frontend.
  static async getCategoryBreakdown(userId) {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: 1,
          count: 1,
        },
      },
      { $sort: { totalAmount: -1 } }, // Show biggest spending first
    ];

    return await Record.aggregate(pipeline);
  }

  // Returns a 6-month trend. We filter by date first to keep the query efficient.
  static async getMonthlyTrends(userId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalIncome: 1,
          totalExpense: 1,
          netSavings: { $subtract: ['$totalIncome', '$totalExpense'] },
        },
      },
      { $sort: { year: 1, month: 1 } }, // Chronological order is better for charts
    ];

    return await Record.aggregate(pipeline);
  }

  // Returns the 5 most recent active records for the user.
  static async getRecentActivity(userId) {
    return await Record.find({ userId, isDeleted: false })
      .sort({ date: -1 })
      .limit(5);
  }
}

module.exports = DashboardService;
