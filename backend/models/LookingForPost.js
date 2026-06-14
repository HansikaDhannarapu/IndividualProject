const mongoose = require('mongoose');

const LookingForPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Books', 'Electronics', 'Cycles', 'Furniture', 'Hostel Essentials', 'Stationery', 'Others'],
      default: 'Others',
    },
    budget: { type: Number },
    description: { type: String },
    status: { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LookingForPost', LookingForPostSchema);
