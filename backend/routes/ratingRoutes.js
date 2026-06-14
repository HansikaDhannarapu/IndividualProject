const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/seller/:sellerId', ratingController.getSellerRatings);
router.post('/', protect, ratingController.createRating);

module.exports = router;
