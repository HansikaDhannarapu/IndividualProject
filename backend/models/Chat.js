// Chat model: represents a chat between users (e.g., buyer and seller)
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
