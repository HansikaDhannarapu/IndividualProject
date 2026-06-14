const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
    type: { $ne: 'offer' },
  }).sort({ createdAt: -1 }).limit(50);
  return res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const filter = { user: req.user._id };
  const { link, type } = req.body || {};

  if (link) filter.link = link;
  if (type) filter.type = type;

  const shouldRemove = ['message', 'priceDropped'].includes(type) && link;

  if (shouldRemove) {
    await Notification.deleteMany(filter);
  } else {
    await Notification.updateMany({ ...filter, read: false }, { read: true });
  }

  const hasUnread = await Notification.exists({
    user: req.user._id,
    read: false,
    type: { $ne: 'offer' },
  });

  return res.json({
    msg: 'Notifications marked as read',
    hasUnread: Boolean(hasUnread),
    removed: shouldRemove,
  });
};
