const RecordService = require('../services/recordService');

class RecordController {
  static async createRecord(req, res) {
    try {
      const record = await RecordService.createRecord(req.body, req.user.id);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getRecords(req, res) {
    try {
      const result = await RecordService.getRecords(req.query, req.user.id, req.user.role);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateRecord(req, res) {
    try {
      const record = await RecordService.updateRecord(req.params.id, req.body, req.user.id, req.user.role);
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      const status = error.message === 'Not authorized to update this record' ? 403 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  static async deleteRecord(req, res) {
    try {
      await RecordService.deleteRecord(req.params.id);
      res.status(200).json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = RecordController;
