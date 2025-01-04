import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../App.css';

const Notifikacija = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  ) : null;
};

// Notification manager
let notificationContainer = null;

export const notifikacija = (message, type = 'info') => {
  // Create container if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }

  // Create a new div for this notification
  const notificationElement = document.createElement('div');
  const root = ReactDOM.createRoot(notificationElement);
  root.render(<Notifikacija message={message} type={type} />);
  notificationContainer.appendChild(notificationElement);

  // Remove the notification after animation
  setTimeout(() => {
    notificationContainer.removeChild(notificationElement);
    if (notificationContainer.children.length === 0) {
      document.body.removeChild(notificationContainer);
      notificationContainer = null;
    }
  }, 3500); // Slightly longer than the visibility timeout
};

export default Notifikacija;
