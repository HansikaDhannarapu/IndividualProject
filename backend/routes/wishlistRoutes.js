const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, wishlistController.getWishlist);
router.post('/', protect, wishlistController.toggleWishlist);

module.exports = router;
