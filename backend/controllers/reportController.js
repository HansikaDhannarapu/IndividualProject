const Report = require('../models/Report');
const { notifyUser } = require('../utils/notification');

exports.createReport = async (req, res) => {
  try {
    const { product, reportedUser, reason, details } = req.body;
    if (!reason) return res.status(400).json({ msg: 'Report reason is required' });

    const report = await Report.create({
      product,
      reportedUser,
      reason,
      details,
      reporter: req.user._id,
    });

    return res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('product', 'name price status isScam')
      .populate('reportedUser', 'name email banned')
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    return res.json(reports);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNote: req.body.adminNote },
      { new: true, runValidators: true }
    );

    if (!report) return res.status(404).json({ msg: 'Report not found' });

    if (report.reporter) {
      await notifyUser(req, {
        user: report.reporter,
        type: 'report',
        title: 'Report updated',
        body: `Your report is now ${report.status}`,
        link: '/notifications',
      });
    }

    return res.json(report);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
