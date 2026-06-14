const Chat = require('../models/Chat');

exports.createOrGetChat = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;
    if (!sellerId) return res.status(400).json({ msg: 'Missing sellerId' });

    const buyerId = req.user._id.toString();
    const members = [buyerId, sellerId].sort();
    const filter = { members: { $all: members, $size: 2 } };
    if (productId) filter.product = productId;

    let chat = await Chat.findOne(filter).populate('members', 'name email').populate('product', 'name price images status');
    if (!chat) {
      chat = await Chat.create({ members, product: productId || undefined });
      chat = await chat.populate('members', 'name email');
      chat = await chat.populate('product', 'name price images status');
    }

    return res.status(201).json(chat);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('product', 'name price images status')
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
