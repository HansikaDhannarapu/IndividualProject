const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/messages  -> create a message
router.post('/', protect, messageController.createMessage);

// GET /api/messages/:chatId -> get messages for a chat
router.get('/:chatId', protect, messageController.getMessages);

module.exports = router;
