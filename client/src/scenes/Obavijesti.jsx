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
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/notifications`, { withCredentials: true });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);
  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (<>
      <Navigacija user={user} otvoreno="obavijesti"/>
      <NavTop user={user} naslov="Obavijesti" />
<div className='main'>
    <div className="karticaZadatka">
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p>{notification.message}</p>
              <p className="notification-date">{new Date(notification.date).toLocaleString()}</p>
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