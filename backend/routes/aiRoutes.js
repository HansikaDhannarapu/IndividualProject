const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/price', protect, aiController.suggestPrice);
router.post('/description', protect, aiController.generateDescription);
router.post('/scam-check', protect, aiController.detectScam);

module.exports = router;
