const Notification = require('../models/Notification');

exports.notifyUser = async (req, payload) => {
  const notification = await Notification.create(payload);
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  const socketId = onlineUsers?.get(payload.user.toString());

  if (io && socketId) {
    io.to(socketId).emit('newNotification', notification);
  }

  return notification;
};
