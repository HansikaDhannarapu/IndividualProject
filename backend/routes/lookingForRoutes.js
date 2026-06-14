const express = require('express');
const router = express.Router();
const lookingForController = require('../controllers/lookingForController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, lookingForController.getPosts);
router.post('/', protect, lookingForController.createPost);

module.exports = router;
