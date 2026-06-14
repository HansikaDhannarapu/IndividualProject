// Authentication controller: register, login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  department: user.department,
  year: user.year,
  profilePic: user.profilePic,
  role: user.role,
});

// Helper: validate university email domain
const isUniversityEmail = (email) => {
  const allowedDomain = (process.env.UNI_EMAIL_DOMAIN || '@anurag.edu').toLowerCase();
  const normalizedDomain = allowedDomain.startsWith('@') ? allowedDomain : `@${allowedDomain}`;

  return email.endsWith(normalizedDomain);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, department, year, profilePic, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    if (password.length < 5) {
      return res.status(400).json({ msg: 'Password must be at least 5 characters' });
    }

    if (!isUniversityEmail(email.toLowerCase())) {
      return res.status(400).json({ msg: 'Registration requires a university email' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      department,
      year,
      profilePic,
      role: role === 'seller' ? 'seller' : 'buyer',
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.status(201).json({ token, user: buildUserResponse(user) });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

    if (!isUniversityEmail(email.toLowerCase())) {
      return res.status(400).json({ msg: 'Login requires a university email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ msg: 'No account found with this email. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.banned) return res.status(403).json({ msg: 'This account has been banned' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ token, user: buildUserResponse(user) });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  return res.json({ user: buildUserResponse(req.user) });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ msg: 'Missing password fields' });

    if (newPassword.length < 5) {
      return res.status(400).json({ msg: 'New password must be at least 5 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
