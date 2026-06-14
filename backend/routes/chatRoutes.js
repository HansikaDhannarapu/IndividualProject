const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, chatController.getMyChats);
router.post('/', protect, chatController.createOrGetChat);

module.exports = router;
