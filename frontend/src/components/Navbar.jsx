import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initSocket, socket } from '../services/socket';
import { getNotifications, NOTIFICATIONS_READ_EVENT } from '../services/notificationService';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [toast, setToast] = useState('');
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

	useEffect(() => {
		if (!user) {
			setHasUnreadNotifications(false);
			return undefined;
		}

		getNotifications()
			.then((notifications) => {
				setHasUnreadNotifications(notifications.some((notification) => !notification.read));
			})
			.catch(() => setHasUnreadNotifications(false));

		initSocket();
		socket.emit('registerUser', user.id);
		socket.on('newNotification', (notification) => {
			setToast(notification.title);
			if (notification.type === 'message') setHasUnreadNotifications(true);
			window.setTimeout(() => setToast(''), 3500);
		});
		const handleNotificationsRead = (event) => {
			setHasUnreadNotifications(Boolean(event.detail?.hasUnread));
		};
		window.addEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);

		return () => {
			socket.off('newNotification');
			window.removeEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);
		};
	}, [user]);

	const handleLogout = () => {
		logout();
		setHasUnreadNotifications(false);
		navigate('/');
	};

	const navClass = ({ isActive }) => (isActive ? 'active' : undefined);
	const browseClass = () => {
		const isBrowsePage = location.pathname === '/' || location.pathname.startsWith('/products') || location.pathname.startsWith('/sellers');
		return isBrowsePage ? 'active' : undefined;
	};

	return (
		<nav className="navbar">
			<Link className="brand" to="/">UniCycle</Link>
			<div className="navLinks">
				<NavLink to="/" className={browseClass}>Browse</NavLink>
				{(user?.role === 'seller' || user?.role === 'admin') && <NavLink to="/sell" className={navClass}>Sell</NavLink>}
				{(user?.role === 'seller' || user?.role === 'admin') && <NavLink to="/my-listings" className={navClass}>My listings</NavLink>}
				{user && <NavLink to="/wishlist" className={navClass}>Wishlist</NavLink>}
				{user && (
					<NavLink to="/notifications" className={navClass}>
						<span className="notificationNavLabel">
							Notifications
							{hasUnreadNotifications && <span className="notificationDot" aria-label="Unread notifications" />}
						</span>
					</NavLink>
				)}
				{user && <NavLink to="/analytics" className={navClass}>Analytics</NavLink>}
				{user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
				{user && <NavLink to="/chat" className={navClass}>Chat</NavLink>}
				{user ? <button onClick={handleLogout}>Logout</button> : <NavLink to="/login" className={navClass}>Login</NavLink>}
			</div>
			{user && (
				<NavLink className="profileButton" to="/profile" aria-label="Open profile">
					{user.profilePic ? <img src={user.profilePic} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>}
				</NavLink>
			)}
			{toast && <div className="toast">{toast}</div>}
		</nav>
	);
};

export default Navbar;
