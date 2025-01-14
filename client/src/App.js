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

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkTokenAndFetchUser = async () => {
    const token = getToken(); // Get token from localStorage or cookies
    if (!token) {
      return false; // No token found
    }

    // Optionally, check if the token is expired
    const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token
    const isExpired = tokenPayload.exp * 1000 < Date.now(); // Check expiration

    if (!isExpired) {
      // Fetch user data if the token is valid
      try {
        const response = await axios.get(`${ApiConfig.baseUrl}/api/user`, { withCredentials: true });
        dispatch(authActions.login(token)); // Log in with the token
        return true; // User is authenticated
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    return false; // User is not authenticated
  };

  useEffect(() => {
    const handleRedirects = async () => {
      const isAuthenticated = await checkTokenAndFetchUser();
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      // Redirect logic based on authentication status
      if (isAuthenticated) {
        // User is authenticated, allow access to all routes
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          navigate('/user'); // Redirect to /user if authenticated
        }
      } else {
        // User is not authenticated, restrict access
        if (isLoggedIn) {
          localStorage.setItem('isLoggedIn', 'false'); // Ensure this is set to false
          navigate('/login'); // Redirect to /login if not authenticated
        }
      }
    };

    handleRedirects();

    // Set an interval to refresh the token every 2 minutes
    const intervalId = setInterval(async () => {
      const newToken = await refreshToken();
      if (newToken) {
        dispatch(authActions.login(newToken)); // Update the token in the store
      }
    }, 120000); // 2 minutes

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Welcome />} />
      {/* Protected Routes */}
      <Route path="/user/*" element={<Naslovna />} />
      <Route path="/profil/*" element={<Profil />} />
      <Route path="/chat/*" element={<Chat />} />
      <Route path="/racuni/*" element={<Racuni />} />
      <Route path="/raspored/*" element={<Raspored />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/korisnici/*" element={<Korisnici />} />
      <Route path="/mentori/*" element={<Mentori />} />
      <Route path="/racuni-admin/*" element={<RacuniAdmin />} />
      <Route path="/classrooms/*" element={<Classrooms />} />
      <Route path="/delete/*" element={<Delete />} />
      <Route path="/obavijesti/*" element={<Obavijesti />} />
    </Routes>
  );
};

export default App;

