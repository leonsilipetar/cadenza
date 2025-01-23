import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { requestNotificationPermission } from '../../services/firebaseMessaging';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ApiConfig from '../apiConfig';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuth();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user) {
      initializeNotifications();
      fetchNotifications();
    }
  }, [user]);

  const initializeNotifications = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await axios.post(
          `${ApiConfig.baseUrl}/api/users/notifications/token`,
          { token },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${ApiConfig.baseUrl}/api/users/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        sx={{ color: 'white' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: '400px',
            width: '300px',
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification._id} onClick={handleClose}>
              <div style={{ width: '100%' }}>
                <Typography variant="subtitle2" style={{ fontWeight: notification.unread ? 'bold' : 'normal' }}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {notification.body}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.date).toLocaleString()}
                </Typography>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Nema novih obavijesti</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell; 