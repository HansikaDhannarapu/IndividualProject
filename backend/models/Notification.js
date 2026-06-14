const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['message', 'productSold', 'wishlistAvailable', 'priceDropped', 'report'],
      default: 'message',
    },
    title: { type: String, required: true },
    body: { type: String },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
