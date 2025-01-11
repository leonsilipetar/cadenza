import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login.js';
import Welcome from './components/Welcome';
import Naslovna from './scenes/naslovna/Naslovna';
import { authActions } from './store/index.js';
import Profil from './scenes/Profile.jsx';
import Chat from './scenes/Chat.jsx';
import Racuni from './scenes/Racuni.jsx';
import Raspored from './scenes/Raspored.jsx';
import Admin from './scenes/administracija/Admin.jsx';
import Korisnici from './scenes/administracija/Korisnici.jsx';
import RacuniAdmin from './scenes/administracija/RacuniAdmin.jsx';
import Mentori from './scenes/administracija/Mentori.jsx';
import Classroom from './scenes/administracija/Classroom.jsx';
import ApiConfig from './components/apiConfig.js';
import { ToastContainer } from 'react-toastify';
import CookieConsent from './components/CookieConsent';
import Delete from './scenes/administracija/Delete';
import Obavijesti from './scenes/Obavijesti';
import { Icon } from '@iconify/react';
import { refreshToken } from './utils/auth';
axios.defaults.withCredentials = true;
function App() {
  const [notifications, setNotifications] = useState([]);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${ApiConfig.baseUrl}/api/user`);

        if (response.data?.user) {
          dispatch(authActions.login());
          const notificationsResponse = await axios.get(`${ApiConfig.baseUrl}/api/notifications`, { withCredentials: true });
          setNotifications(notificationsResponse.data);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      if (location.pathname !== '/' && location.pathname !== '/login') {
        navigate('/', { replace: true });
      }
    } else if (location.pathname === '/') {
      navigate('/user', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isLoggedIn) {
        const newToken = await refreshToken();
        if (newToken) {
          dispatch(authActions.login(newToken));
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(authActions.login(token));
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${ApiConfig.baseUrl}/api/login`, { email, password });
      if (response.status === 200) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          dispatch(authActions.login(token));
        } else {
          console.error('Token is undefined');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch(authActions.logout());
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login handleLogin={handleLogin} /> : <Navigate to="/user" />} />
        <Route path="/" element={!isLoggedIn ? <Welcome /> : <Navigate to="/user" />} />
        {isLoggedIn && (
          <>
            <Route path="/user/*" element={<Naslovna />} />
            <Route path="/profil/*" element={<Profil />} />
            <Route path="/chat/*" element={<Chat />} />
            <Route path="/racuni/*" element={<Racuni />} />
            <Route path="/raspored/*" element={<Raspored />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/delete" element={<Delete />} />
            <Route path="/korisnici/*" element={<Korisnici />} />
            <Route path="/mentori/*" element={<Mentori />} />
            <Route path="/racuni-admin/*" element={<RacuniAdmin />} />
            <Route path="/classrooms/*" element={<Classroom />} />
            <Route path="/obavijesti" element={<Obavijesti notifications={notifications} />} />
          </>
        )}
      </Routes>
      <ToastContainer />
      <CookieConsent />
    </>
  );
}
export default App;
