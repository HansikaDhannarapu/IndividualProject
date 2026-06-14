import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import SellProduct from './pages/SellProduct';
import ProductDetails from './pages/ProductDetails';
import MyListings from './pages/MyListings';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import EditProduct from './pages/EditProduct';
import SellerProfile from './pages/SellerProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route path="/products/:id/edit" element={<ProtectedRoute roles={['seller', 'admin']}><EditProduct /></ProtectedRoute>} />
					<Route path="/sellers/:sellerId" element={<SellerProfile />} />
					<Route path="/sell" element={<ProtectedRoute roles={['seller', 'admin']}><SellProduct /></ProtectedRoute>} />
					<Route path="/my-listings" element={<ProtectedRoute roles={['seller', 'admin']}><MyListings /></ProtectedRoute>} />
					<Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
					<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
					<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
					<Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
					<Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
					<Route path="/chat/:chatId?" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default App;

