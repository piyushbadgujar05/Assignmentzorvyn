const Record = require('../models/Record');
const mongoose = require('mongoose');

class RecordService {
  /**
   * Create a new financial record
   */
  static async createRecord(data, userId) {
    return await Record.create({
      ...data,
      userId
    });
  }

  /**
   * Get records with pagination, filtering, and sorting
   */
  static async getRecords(query, userId, userRole) {
    const { page = 1, limit = 10, type, category, sortBy = 'date', order = 'desc' } = query;
    
    // Build filter
    const filter = { isDeleted: false };
    
    // Ownership check: Analysts only see their own records
    if (userRole === 'analyst') {
      filter.userId = userId;
    } else if (userRole === 'viewer') {
      // Viewers might see all or restricted, assuming all for now but read-only
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const records = await Record.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Record.countDocuments(filter);

    return {
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update a record with ownership check
   */
  static async updateRecord(id, data, userId, userRole) {
    const record = await Record.findOne({ _id: id, isDeleted: false });
    
    if (!record) throw new Error('Record not found');

    // Ownership check for analysts
    if (userRole === 'analyst' && record.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this record');
    }

    Object.assign(record, data);
    return await record.save();
  }

  /**
   * Soft delete a record (Admin only)
   */
  static async deleteRecord(id) {
    const record = await Record.findById(id);
    if (!record) throw new Error('Record not found');

    record.isDeleted = true;
    record.deletedAt = new Date();
    return await record.save();
  }
}

module.exports = RecordService;
