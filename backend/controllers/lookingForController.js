const LookingForPost = require('../models/LookingForPost');

exports.createPost = async (req, res) => {
  try {
    const { title, category, budget, description } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const post = await LookingForPost.create({
      user: req.user._id,
      title,
      category,
      budget,
      description,
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await LookingForPost.find({ status: 'open' })
      .populate('user', 'name department year')
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
