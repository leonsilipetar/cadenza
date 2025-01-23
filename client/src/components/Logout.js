import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authActions } from '../store/authSlice';
import ApiConfig from './apiConfig';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${ApiConfig.baseUrl}/api/logout`,
        { action: 'logout' },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and redirect
      dispatch(authActions.logout());
      localStorage.clear(); // Clear all localStorage items
      sessionStorage.clear(); // Clear all sessionStorage items

      // Clear any other stored data
      localStorage.removeItem('notificationPermissionRequested');

      // Remove any cookies (as a backup)
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });

      navigate('/login');
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;