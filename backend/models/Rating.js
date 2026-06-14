const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    communication: { type: Number, min: 1, max: 5, required: true },
    productQuality: { type: Number, min: 1, max: 5, required: true },
    punctuality: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', RatingSchema);
