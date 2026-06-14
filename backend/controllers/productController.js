// Product controller for CRUD operations
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const { notifyUser } = require('../utils/notification');

const getWishlistProductIdSet = async (userId) => {
  if (!userId) return new Set();
  const wishlist = await Wishlist.findOne({ user: userId }).select('products');
  return new Set((wishlist?.products || []).map((id) => id.toString()));
};

const withWishlistFlag = (product, wishlistProductIds) => {
  const productObject = product.toObject ? product.toObject() : product;
  return {
    ...productObject,
    isWishlisted: wishlistProductIds.has(productObject._id.toString()),
  };
};

const buildUploadedImageUrls = (req) => {
  if (!req.files?.length) return [];
  return req.files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
};

const parseImageUrls = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return images
    .split(/\r?\n|,\s*(?=https?:\/\/)/i)
    .map((url) => url.trim())
    .filter(Boolean);
};

// Create a product (seller only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, condition, price, originalPrice, age, pickupLocation } = req.body;
    if (!name || !description || !price || !req.user) return res.status(400).json({ msg: 'Missing fields' });
    const uploadedImages = buildUploadedImageUrls(req);
    const linkedImages = parseImageUrls(req.body.imageUrls);

    const product = new Product({
      name,
      description,
      category,
      condition,
      price,
      originalPrice,
      age,
      pickupLocation,
      seller: req.user._id,
      images: [...uploadedImages, ...linkedImages],
      quickSell: req.body.quickSell === 'true' || req.body.quickSell === true,
      bundleItems: parseImageUrls(req.body.bundleItems),
    });
    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get all products with optional filters
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort = 'newest' } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 24);
    const skip = (page - 1) * limit;
    let filter = { status: 'available' };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter).populate('seller', 'name email role');

    if (sort === 'quickSell') query = query.sort({ quickSell: -1, createdAt: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else if (sort === 'cheapest') query = query.sort({ price: 1 });
    else if (sort === 'priciest') query = query.sort({ price: -1 });
    else if (sort === 'highestRated') query = query.sort({ createdAt: -1 });

    const [products, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    const wishlistProductIds = await getWishlistProductIdSet(req.user?._id);

    return res.json({
      products: products.map((product) => withWishlistFlag(product, wishlistProductIds)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    // Increment views
    product.views += 1;
    await product.save();
    const wishlistProductIds = await getWishlistProductIdSet(req.user?._id);
    return res.json(withWishlistFlag(product, wishlistProductIds));
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Update product (seller only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const previousStatus = product.status;
    const previousPrice = product.price;
    const uploadedImages = buildUploadedImageUrls(req);
    const linkedImages = parseImageUrls(req.body.imageUrls);
    const shouldReplaceImages = req.body.imageUrls !== undefined || uploadedImages.length > 0;
    const updates = { ...req.body };
    delete updates.imageUrls;

    if (updates.bundleItems !== undefined) {
      updates.bundleItems = parseImageUrls(updates.bundleItems);
    }

    if (updates.quickSell !== undefined) {
      updates.quickSell = updates.quickSell === 'true' || updates.quickSell === true;
    }

    Object.assign(product, updates);
    if (shouldReplaceImages) {
      product.images = [...linkedImages, ...uploadedImages];
    }
    await product.save();

    if (previousStatus !== product.status || Number(previousPrice) !== Number(product.price)) {
      const wishlists = await Wishlist.find({ products: product._id });
      const notifications = wishlists
        .filter((wishlist) => wishlist.user.toString() !== req.user._id.toString())
        .map((wishlist) => {
          const priceDropped = Number(product.price) < Number(previousPrice);
          return {
            user: wishlist.user,
            type: product.status === 'sold' ? 'productSold' : priceDropped ? 'priceDropped' : 'wishlistAvailable',
            title: product.status === 'sold' ? 'Wishlist item sold' : priceDropped ? 'Wishlist price dropped' : 'Wishlist item updated',
            body: `${product.name} is now ${product.status} at Rs. ${product.price}`,
            link: `/products/${product._id}`,
          };
        });

      if (notifications.length) {
        await Promise.all(notifications.map((notification) => notifyUser(req, notification)));
      }
    }

    return res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Delete product (seller only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get seller's products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId }).populate('seller', 'name email department year');
    return res.json(products);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
