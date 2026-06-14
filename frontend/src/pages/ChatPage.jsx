import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_URL, authHeaders, getStoredUser } from '../services/api';
import { getMyChats } from '../services/chatService';
import { markNotificationsRead } from '../services/notificationService';
import { initSocket, socket } from '../services/socket';

const getSenderId = (sender) => {
  if (!sender) return '';
  if (typeof sender === 'string') return sender;
  return sender._id || sender.id || '';
};

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    initSocket();
    socket.emit('registerUser', user.id);
    socket.on('onlineUsers', setOnlineUsers);
    getMyChats().then(setChats).catch((err) => setStatus(err.message));

    return () => {
      socket.off('onlineUsers', setOnlineUsers);
    };
  }, []);

  useEffect(() => {
    if (!chatId) return;
    initSocket();
    socket.emit('join', chatId);
    socket.emit('markSeen', { chatId, userId: user.id });
    markNotificationsRead({ type: 'message', link: `/chat/${chatId}` }).catch(() => {});

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        if (msg.clientId) {
          const optimisticIndex = prev.findIndex((item) => item.clientId === msg.clientId);
          if (optimisticIndex !== -1) {
            return prev.map((item, index) => (index === optimisticIndex ? msg : item));
          }
        }

        if (prev.some((item) => item._id && item._id === msg._id)) return prev;
        return [...prev, msg];
      });
      socket.emit('markSeen', { chatId, userId: user.id });
    };

    const handleMessagesSeen = ({ chatId: seenChatId, userId }) => {
      if (seenChatId !== chatId || userId === user.id) return;

      setMessages((prev) =>
        prev.map((message) =>
          getSenderId(message.sender) === user.id ? { ...message, read: true } : message
        )
      );
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messagesSeen', handleMessagesSeen);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages/${chatId}`, { headers: authHeaders() });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setStatus(err.message);
      }
    };

    fetchMessages();

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messagesSeen', handleMessagesSeen);
    };
  }, [chatId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const clientId = `${user.id}-${Date.now()}`;
    const payload = { chatId, sender: user.id, text: text.trim(), clientId };
    const optimisticMessage = {
      ...payload,
      createdAt: new Date().toISOString(),
      read: false,
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    initSocket();
    socket.emit('sendMessage', payload);
    setText('');
  };

  return (
    <main className="chatLayout">
      <aside className="chatList">
        <h2>Chats</h2>
        {chats.map((chat) => (
          <Link className={chat._id === chatId ? 'chatLink active' : 'chatLink'} key={chat._id} to={`/chat/${chat._id}`}>
            <strong>{chat.product?.name || 'Campus chat'}</strong>
            <span>
              {chat.members?.filter((member) => member._id !== user?.id).map((member) => {
                const online = onlineUsers.includes(member._id);
                return `${member.name}${online ? ' online' : ' offline'}`;
              }).join(', ')}
            </span>
          </Link>
        ))}
        {!chats.length && <p className="status">Open a product and message the seller to start.</p>}
      </aside>
      <section className="chatPanel">
        <h2>{chatId ? 'Messages' : 'Select a chat'}</h2>
        <div
          ref={messagesRef}
          className="messages"
        >
          {messages.map((m) => {
            const isMine = getSenderId(m.sender) === user?.id;
            return (
              <div key={m._id || m.clientId || `${getSenderId(m.sender)}-${m.createdAt}`} className={isMine ? 'message mine' : 'message'}>
                <strong>{isMine ? 'You' : 'Them'}</strong>
                <div>{m.text}</div>
                <small>{m.pending ? 'Sending...' : new Date(m.createdAt).toLocaleString()} {m.read ? 'Seen' : ''}</small>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} className="messageForm">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={!chatId}
          />
          <button className="button primary" type="submit" disabled={!chatId}>
            Send
          </button>
        </form>
        {status && <p className="status error">{status}</p>}
      </section>
    </main>
  );
};

export default ChatPage;
