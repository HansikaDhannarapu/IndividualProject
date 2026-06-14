// Basic Express + Socket.io server for Campus Resell Portal
// Sets up API routes and real-time socket messaging
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');
const lookingForRoutes = require('./routes/lookingForRoutes');

// Models
const Message = require('./models/Message');
const Chat = require('./models/Chat');
const Notification = require('./models/Notification');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Connect to DB
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/looking-for', lookingForRoutes);

app.get('/', (req, res) => {
	res.send('Campus Resell Portal API');
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io setup
const { Server } = require('socket.io');
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL || 'http://localhost:5173,https://individualproject-2b0a.onrender.com'
		methods: ['GET', 'POST'],
	},
});

const onlineUsers = new Map();
app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.on('connection', (socket) => {
	console.log('New socket connected:', socket.id);

	socket.on('registerUser', (userId) => {
		onlineUsers.set(userId, socket.id);
		io.emit('onlineUsers', Array.from(onlineUsers.keys()));
	});

	// Join a chat room
	socket.on('join', (chatId) => {
		socket.join(chatId);
	});

	// Receive message from client, save it, and broadcast to room
	socket.on('sendMessage', async (data) => {
		// data: { chatId, sender, text, clientId }
		try {
			const newMsg = new Message({
				chat: data.chatId,
				sender: data.sender,
				text: data.text,
			});
			const saved = await newMsg.save();
			const message = { ...saved.toObject(), clientId: data.clientId };
			io.to(data.chatId).emit('receiveMessage', message);

			const chat = await Chat.findById(data.chatId);
			if (chat) {
				const recipients = chat.members.filter((member) => member.toString() !== data.sender);
				await Promise.all(recipients.map(async (recipient) => {
					const notification = await Notification.create({
						user: recipient,
						type: 'message',
						title: 'New message',
						body: data.text,
						link: `/chat/${data.chatId}`,
					});
					const recipientSocket = onlineUsers.get(recipient.toString());
					if (recipientSocket) io.to(recipientSocket).emit('newNotification', notification);
				}));
			}
		} catch (err) {
			console.error('Socket save message error:', err.message);
		}
	});

	socket.on('markSeen', async ({ chatId, userId }) => {
		await Message.updateMany({ chat: chatId, sender: { $ne: userId }, read: false }, { read: true });
		await Notification.deleteMany({ user: userId, type: 'message', link: `/chat/${chatId}` });
		io.to(chatId).emit('messagesSeen', { chatId, userId });
	});

	socket.on('disconnect', () => {
		for (const [userId, socketId] of onlineUsers.entries()) {
			if (socketId === socket.id) onlineUsers.delete(userId);
		}
		io.emit('onlineUsers', Array.from(onlineUsers.keys()));
	});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

