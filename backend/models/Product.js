// Product model for Campus Resell Portal
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Books', 'Electronics', 'Cycles', 'Furniture', 'Hostel Essentials', 'Stationery', 'Others'],
      default: 'Others',
    },
    condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor'], default: 'Good' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    age: { type: String },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
    pickupLocation: { type: String, default: 'Library Gate' },
    quickSell: { type: Boolean, default: false },
    isScam: { type: Boolean, default: false },
    bundleItems: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
