// Database connection helper using mongoose
// Keeps DB connection logic in one place for reuse
const mongoose = require('mongoose');

const connectDB = async () => {
	const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-resell';
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
