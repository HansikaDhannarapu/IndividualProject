const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: {
      type: String,
      enum: ['fake product', 'scam', 'abusive seller', 'wrong pricing'],
      required: true,
    },
    details: { type: String },
    status: { type: String, enum: ['open', 'reviewing', 'resolved'], default: 'open' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
