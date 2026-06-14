const Product = require('../models/Product');
const User = require('../models/User');

exports.getMarketplaceAnalytics = async (req, res) => {
  try {
    const [
      productStats,
      userCount,
      categoryStats,
      statusStats,
      pickupStats,
      recentProducts,
    ] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalListings: { $sum: 1 },
            activeListings: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
            soldListings: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
            totalViews: { $sum: '$views' },
            averagePrice: { $avg: '$price' },
          },
        },
      ]),
      User.countDocuments({ banned: false }),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, averagePrice: { $avg: '$price' } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Product.aggregate([
        { $group: { _id: '$pickupLocation', count: { $sum: 1 }, views: { $sum: '$views' } } },
        { $sort: { count: -1, views: -1 } },
      ]),
      Product.find()
        .populate('seller', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const stats = productStats[0] || {
      totalListings: 0,
      activeListings: 0,
      soldListings: 0,
      totalViews: 0,
      averagePrice: 0,
    };

    return res.json({
      summary: {
        ...stats,
        averagePrice: Math.round(stats.averagePrice || 0),
        users: userCount,
      },
      categories: categoryStats,
      statuses: statusStats,
      pickupLocations: pickupStats,
      mostSoldCategory: categoryStats[0]?._id || 'No sales yet',
      mostViewedCategory: categoryStats[0]?._id || 'No views yet',
      recentProducts,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
