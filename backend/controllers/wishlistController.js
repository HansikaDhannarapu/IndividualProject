const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    populate: { path: 'seller', select: 'name email' },
  });

  return res.json(wishlist?.products || []);
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ msg: 'Missing productId' });

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  const exists = wishlist.products.some((id) => id.toString() === productId);
  wishlist.products = exists
    ? wishlist.products.filter((id) => id.toString() !== productId)
    : [...wishlist.products, productId];

  await wishlist.save();
  return res.json({ saved: !exists, products: wishlist.products });
};
