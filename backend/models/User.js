// User model for Campus Resell Portal
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    department: { type: String },
    year: { type: String },
    profilePic: { type: String },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
