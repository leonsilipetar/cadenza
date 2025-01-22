import React, { useEffect } from 'react';
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

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkTokenAndFetchUser = async () => {
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
  };

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
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} aria-label="Login page" />
      <Route path="/" element={<Welcome />} aria-label="Welcome page" />
      {/* Protected Routes with aria-labels */}
      <Route path="/user/*" element={<Naslovna />} aria-label="Home page" />
      <Route path="/profil/*" element={<Profil />} aria-label="Profile page" />
      <Route path="/chat/*" element={<Chat />} aria-label="Chat page" />
      <Route path="/racuni/*" element={<Racuni />} aria-label="Invoices page" />
      <Route path="/raspored/*" element={<Raspored />} aria-label="Schedule page" />
      <Route path="/admin/*" element={<Admin />} aria-label="Admin page" />
      <Route path="/korisnici/*" element={<Korisnici />} aria-label="Users page" />
      <Route path="/mentori/*" element={<Mentori />} aria-label="Mentors page" />
      <Route path="/racuni-admin/*" element={<RacuniAdmin />} aria-label="Admin invoices page" />
      <Route path="/classrooms/*" element={<Classrooms />} aria-label="Classrooms page" />
      <Route path="/delete/*" element={<Delete />} aria-label="Delete page" />
      <Route path="/obavijesti/*" element={<Obavijesti />} aria-label="Notifications page" />
    </Routes>
  );
};

export default App;

