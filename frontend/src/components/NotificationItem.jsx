import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, readHighlighted = false }) => {
  const className = !notification.read
    ? 'listItem unread'
    : readHighlighted
      ? 'listItem readHighlighted'
      : 'listItem';

  return (
    <Link className={className} to={notification.link || '/'}>
      <div>
        <p className="meta">{notification.type}</p>
        <h2>{notification.title}</h2>
        <p>{notification.body}</p>
      </div>
      <small>{new Date(notification.createdAt).toLocaleString()}</small>
    </Link>
  );
};

export default NotificationItem;
