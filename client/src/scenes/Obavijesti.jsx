import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig.js';
import './Obavijesti.css'; // Optional: Create a CSS file for specific styles

const Obavijesti = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/notifications`, { 
        withCredentials: true 
      });
      setNotifications(res.data);
      
      // Mark notifications as read
      if (res.data.some(notification => notification.unread)) {
        await axios.post(
          `${ApiConfig.baseUrl}/api/notifications/mark-read`,
          {},
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Navigacija user={user} otvoreno="obavijesti" />
      <NavTop user={user} naslov="Obavijesti" />
      <div className='main'>
        <div className="karticaZadatka">
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div 
                  key={notification._id || index} 
                  className={`notification-item ${notification.unread ? 'unread' : ''}`}
                >
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-date">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>Nema obavijesti!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Obavijesti;