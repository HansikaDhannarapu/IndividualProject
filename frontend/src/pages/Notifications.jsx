import React, { useEffect, useState } from 'react';
import NotificationItem from '../components/NotificationItem';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import {
  getNotifications,
  markNotificationsRead,
  NOTIFICATIONS_READ_EVENT,
} from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('Loading notifications...');
  const [readHighlighted, setReadHighlighted] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((data) => {
        setNotifications(data);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, []);

  useEffect(() => {
    const handleNotificationsRead = (event) => {
      const { type, link, removed } = event.detail || {};
      if (!removed || !type || !link) return;

      setNotifications((items) =>
        items.filter((item) => item.type !== type || item.link !== link)
      );
    };

    window.addEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);

    return () => {
      window.removeEventListener(NOTIFICATIONS_READ_EVENT, handleNotificationsRead);
    };
  }, []);

  const markRead = async () => {
    try {
      await markNotificationsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      setReadHighlighted(true);
      setStatus('');
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <main>
      <PageHeader
        title="Notifications"
        action={(
          <button
            className={readHighlighted ? 'button secondary readActionActive' : 'button secondary'}
            onClick={markRead}
          >
            Mark all read
          </button>
        )}
      />
      <StatusMessage>{status}</StatusMessage>
      <section className="listStack">
        {notifications.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} readHighlighted={readHighlighted} />
        ))}
      </section>
      {!status && notifications.length === 0 && <StatusMessage>No notifications yet.</StatusMessage>}
    </main>
  );
};

export default Notifications;
