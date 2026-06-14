const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, reportController.createReport);
router.get('/', protect, adminOnly, reportController.getReports);
router.put('/:id', protect, adminOnly, reportController.updateReport);

module.exports = router;
