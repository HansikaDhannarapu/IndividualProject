require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Wishlist = require('../models/Wishlist');
const Rating = require('../models/Rating');
const Report = require('../models/Report');
const LookingForPost = require('../models/LookingForPost');

const users = [
  { name: 'Admin User', email: 'admin@anurag.edu', role: 'admin', department: 'Marketplace Office', year: 'Staff' },
  { name: 'Asha Rao', email: 'asha@anurag.edu', role: 'seller', department: 'Computer Science', year: '3rd year' },
  { name: 'Kabir Mehta', email: 'kabir@anurag.edu', role: 'seller', department: 'Mechanical', year: '4th year' },
  { name: 'Nina Paul', email: 'nina2026@anurag.edu', role: 'buyer', department: 'Design', year: '2nd year' },
];

const products = [
  {
    name: 'Data Structures textbook bundle',
    description: 'Clean notes, previous-year question papers, and two reference books.',
    category: 'Books',
    condition: 'Good',
    price: 650,
    originalPrice: 1800,
    age: '1 year',
    pickupLocation: 'Library Gate',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'],
    bundleItems: ['CLRS notes', 'Question papers'],
  },
  {
    name: 'Single-speed campus cycle',
    description: 'Recently serviced, new brake pads, ideal for hostel to main block rides.',
    category: 'Cycles',
    condition: 'Good',
    price: 3200,
    originalPrice: 6200,
    age: '18 months',
    pickupLocation: 'Parking Area',
    quickSell: true,
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Study desk lamp',
    description: 'Warm and white light modes with flexible neck and USB power.',
    category: 'Hostel Essentials',
    condition: 'Fair',
    price: 350,
    originalPrice: 900,
    age: '8 months',
    pickupLocation: 'Hostel Block A',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'],
  },
];

const seed = async () => {
  await connectDB();
  await Promise.all([
    Product.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Wishlist.deleteMany({}),
    Rating.deleteMany({}),
    Report.deleteMany({}),
    LookingForPost.deleteMany({}),
    User.deleteMany({ email: { $in: users.map((user) => user.email) } }),
  ]);

  const password = await bcrypt.hash('password123', 10);
  const createdUsers = await User.insertMany(users.map((user) => ({ ...user, password })));
  const [, asha, kabir, nina] = createdUsers;

  const createdProducts = await Product.insertMany([
    { ...products[0], seller: asha._id, views: 18 },
    { ...products[1], seller: kabir._id, views: 42 },
    { ...products[2], seller: asha._id, views: 11 },
  ]);

  await Wishlist.create({ user: nina._id, products: [createdProducts[1]._id, createdProducts[2]._id] });
  await Rating.create({
    seller: asha._id,
    buyer: nina._id,
    product: createdProducts[0]._id,
    communication: 5,
    productQuality: 5,
    punctuality: 4,
    comment: 'Helpful seller and clean books.',
  });
  await LookingForPost.create({
    user: nina._id,
    title: 'Looking for a scientific calculator',
    category: 'Electronics',
    budget: 700,
    description: 'Need it before next lab evaluation.',
  });
  console.log('Seed complete. Demo login: admin@anurag.edu / password123');
  await mongoose.connection.close();
};

seed().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});
