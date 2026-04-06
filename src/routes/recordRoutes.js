const express = require('express');
const RecordController = require('../controllers/recordController');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

// protect: all record routes require auth
router.use(protect);

router.get('/', RecordController.getRecords);
router.post('/', authorize('analyst', 'admin'), RecordController.createRecord);
router.patch('/:id', authorize('analyst', 'admin'), RecordController.updateRecord);
router.delete('/:id', authorize('admin'), RecordController.deleteRecord);

module.exports = router;
