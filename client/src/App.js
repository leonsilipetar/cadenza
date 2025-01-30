import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authActions } from './store/index.js';
import { getToken } from './utils/tokenUtils';
import ApiConfig from './components/apiConfig.js';
import Login from './components/Login.js';
import Welcome from './components/Welcome';
import Naslovna from './scenes/naslovna/Naslovna';
import Profil from './scenes/Profile.jsx';
import Chat from './scenes/Chat.jsx';
import Racuni from './scenes/Racuni.jsx';
import Raspored from './scenes/Raspored.jsx';
import Admin from './scenes/administracija/Admin.jsx';
import Korisnici from './scenes/administracija/Korisnici.jsx';
import RacuniAdmin from './scenes/administracija/RacuniAdmin.jsx';
import Mentori from './scenes/administracija/Mentori.jsx';
import Classrooms from './scenes/administracija/Classroom.jsx';
import { refreshToken } from './utils/auth';
import Delete from './scenes/administracija/Delete.jsx';
import Obavijesti from './scenes/Obavijesti.jsx';
import { isPWA, setPWAUser, getPWAUser, clearPWAUser } from './utils/pwaUtils';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationComponent from './components/NotificationComponent';
import { io } from 'socket.io-client'; // Ensure you have socket.io-client installed
import Programs from './scenes/administracija/Programs.jsx';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const socket = io('https://musicartincubator-cadenza.onrender.com'); // Update with your socket server URL
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  const checkTokenAndFetchUser = useCallback(async () => {
    // Check if running as PWA and has stored authentication
    if (isPWA() && localStorage.getItem('isPWAAuthenticated') === 'true') {
      const pwaUser = getPWAUser();
      if (pwaUser) {
        dispatch(authActions.login('pwa-session')); // Special token for PWA
        return true;
      }
    }

    // Regular web authentication flow
    const token = getToken();
    if (!token) {
      return false;
    }

    // Token validation and user fetch
    try {
      const response = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
        withCredentials: true
      });

      if (isPWA()) {
        // Store user data for PWA
        setPWAUser(response.data.user);
      }

      dispatch(authActions.login(token));
      return true;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  }, [dispatch]); // Add dispatch as a dependency

  useEffect(() => {
    const handleRedirects = async () => {
      const isAuthenticated = await checkTokenAndFetchUser();
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isAuthenticated) {
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          navigate('/user');
        }
      } else {
        if (isLoggedIn) {
          localStorage.setItem('isLoggedIn', 'false');
          clearPWAUser(); // Clear PWA authentication
          navigate('/login');
        }
      }
    };

    handleRedirects();

    // Check token once a day instead of every 2 minutes
    const intervalId = setInterval(async () => {
      const newToken = await refreshToken();
      if (newToken) {
        dispatch(authActions.login(newToken));
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(intervalId);
  }, [dispatch, navigate, checkTokenAndFetchUser]);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (!isChatWindowOpen) {
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('Nova poruka', {
            body: `${message.senderName}: ${message.text}`,
            icon: '/path/to/your/icon.png' // Add your notification icon
          });
        }

        // Add to notifications state
        setNotifications(prev => [...prev, {
          id: message._id,
          senderName: message.senderName,
          text: message.text,
          timestamp: message.timestamp,
          unread: true
        }]);

        // Play notification sound
        const audio = new Audio('/path/to/notification-sound.mp3'); // Add your notification sound
        audio.play().catch(e => console.log('Error playing sound:', e));
      }
    });

    // Request notification permission on mount
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('newMessage');
    };
  }, [socket, isChatWindowOpen]);

  // Function to clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Welcome />} />

        {/* Protected Routes */}
        <Route path="/user/*" element={
          <ProtectedRoute>
            <Naslovna />
          </ProtectedRoute>
        } />
        <Route path="/profil/*" element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        } />
        <Route path="/chat/*" element={
          <ProtectedRoute>
            <Chat setIsChatWindowOpen={setIsChatWindowOpen} />
          </ProtectedRoute>
        } />
        <Route path="/racuni/*" element={
          <ProtectedRoute>
            <Racuni />
          </ProtectedRoute>
        } />
        <Route path="/raspored/*" element={
          <ProtectedRoute>
            <Raspored />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/korisnici/*" element={
          <ProtectedRoute>
            <Korisnici />
          </ProtectedRoute>
        } />
        <Route path="/mentori/*" element={
          <ProtectedRoute>
            <Mentori />
          </ProtectedRoute>
        } />
        <Route path="/racuni-admin/*" element={
          <ProtectedRoute>
            <RacuniAdmin />
          </ProtectedRoute>
        } />
        <Route path="/programi/*" element={
          <ProtectedRoute>
            <Programs/>
          </ProtectedRoute>
        } />
        <Route path="/classrooms/*" element={
          <ProtectedRoute>
            <Classrooms />
          </ProtectedRoute>
        } />
        <Route path="/delete/*" element={
          <ProtectedRoute>
            <Delete />
          </ProtectedRoute>
        } />
        <Route path="/obavijesti/*" element={
          <ProtectedRoute>
            <Obavijesti />
          </ProtectedRoute>
        } />
      </Routes>
      <NotificationComponent notifications={notifications} />
    </>
  );
};

export default App;