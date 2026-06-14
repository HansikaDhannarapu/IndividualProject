// Controller for message REST endpoints
const Message = require('../models/Message');

// Create and save a new message
exports.createMessage = async (req, res) => {
  try {
    const { chatId, sender, text } = req.body;
    if (!chatId || !text) return res.status(400).json({ msg: 'Missing fields' });

    const message = new Message({ chat: chatId, sender: req.user?._id || sender, text });
    const saved = await message.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
    return res.json(messages);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
