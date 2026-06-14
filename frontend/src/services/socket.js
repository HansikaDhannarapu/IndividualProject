// Simple socket client wrapper for frontend
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://individualproject-2b0a.onrender.com';

// Create and export a singleton socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Initialize and connect socket
export const initSocket = () => {
  if (!socket.connected) socket.connect();
  return socket;
};

export default socket;
