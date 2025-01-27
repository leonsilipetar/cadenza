import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationComponent.css';

const NotificationComponent = ({ notifications }) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    navigate('/chat');
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id || index}
          className="notification"
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="notification-header">
            <span className="notification-sender">{notification.senderName}</span>
            <span className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="notification-content">
            {notification.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent; 