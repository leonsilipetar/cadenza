import React from 'react';
import { useEffect, useState } from 'react';
import '../App.css';

const Notification = ({ message, action, onActionClick, notification }) => {
    const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timeoutId);
  }, [notification]);
  return (
    <div className={`notification ${isVisible ? 'visible' : 'hidden'}`}>
      <p>{message}</p>
      {action && <button onClick={onActionClick}>{action}</button>}
    </div>
  );
};

export default Notification;
