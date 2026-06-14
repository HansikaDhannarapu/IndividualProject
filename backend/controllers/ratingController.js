const Rating = require('../models/Rating');

exports.createRating = async (req, res) => {
  const { seller, product, communication, productQuality, punctuality, comment } = req.body;
  if (!seller || !communication || !productQuality || !punctuality) return res.status(400).json({ msg: 'Missing rating fields' });

  const rating = await Rating.create({
    seller,
    buyer: req.user._id,
    product,
    communication,
    productQuality,
    punctuality,
    comment,
  });

  return res.status(201).json(rating);
};

exports.getSellerRatings = async (req, res) => {
  const ratings = await Rating.find({ seller: req.params.sellerId }).populate('buyer', 'name').sort({ createdAt: -1 });
  const average = ratings.length
    ? ratings.reduce((sum, rating) => sum + (rating.communication + rating.productQuality + rating.punctuality) / 3, 0) / ratings.length
    : 0;

  return res.json({ ratings, average: Number(average.toFixed(1)), count: ratings.length });
};
