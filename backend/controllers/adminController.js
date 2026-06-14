const Product = require('../models/Product');
const User = require('../models/User');
const Report = require('../models/Report');

exports.getAdminDashboard = async (req, res) => {
  try {
    const [users, products, reports] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).limit(100),
      Product.find().populate('seller', 'name email banned').sort({ createdAt: -1 }).limit(100),
      Report.find()
        .populate('product', 'name price status isScam')
        .populate('reportedUser', 'name email banned')
        .populate('reporter', 'name email')
        .sort({ createdAt: -1 })
        .limit(100),
    ]);

    return res.json({ users, products, reports });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [users, products, reports, scamAlerts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Report.countDocuments({ status: { $ne: 'resolved' } }),
      Product.countDocuments({ isScam: true }),
    ]);

    return res.json({ users, products, openReports: reports, scamAlerts });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.setUserBan = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ msg: 'Admins cannot ban their own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: Boolean(req.body.banned) },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.setProductFlag = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isScam: Boolean(req.body.isScam), status: req.body.status },
      { new: true, runValidators: true }
    ).populate('seller', 'name email banned');

    if (!product) return res.status(404).json({ msg: 'Product not found' });
    return res.json(product);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    return res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
