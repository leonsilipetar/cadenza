import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
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
import Recepti from './scenes/recepti/Recepti';
axios.defaults.withCredentials = true;
function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const cookieExists = document.cookie.includes('yourCookieNameHere');
    if (cookieExists) {
      dispatch(authActions.login());
    }
  }, [dispatch]);
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/');
    }
  }, [isLoggedIn, location, navigate]);
  useEffect(() => {
    const interval = setInterval(() => {
      axios.post(`${ApiConfig.baseUrl}/api/refresh`, {}, { withCredentials: true })
        .then((response) => {
          // Handle the new access token here if needed
        })
        .catch((error) => {
          console.error("Failed to refresh token", error);
        });
    }, 50 * 1000); // 50 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);
  return (
    <Routes>
      <Route path="/login/*" element={<Login />} />
      <Route path="/recepti/*" element={<Recepti />} />
      <Route path="/*" element={<Welcome />} />
      {isLoggedIn && <Route path="/user/*" element={<Naslovna />} />}
      {isLoggedIn && <Route path="/profil/*" element={<Profil />} />}
      {isLoggedIn && <Route path="/chat/*" element={<Chat />} />}
      {isLoggedIn && <Route path="/racuni/*" element={<Racuni />} />}
      {isLoggedIn && <Route path="/raspored/*" element={<Raspored />} />}
      {isLoggedIn && <Route path="/admin/*" element={<Admin />} />}
      {isLoggedIn && <Route path="/korisnici/*" element={<Korisnici />} />}
      {isLoggedIn && <Route path="/mentori/*" element={<Mentori />} />}
      {isLoggedIn && <Route path="/racuni-admin/*" element={<RacuniAdmin />} />}
      {isLoggedIn && <Route path="/classrooms/*" element={<Classroom />} />}

    </Routes>
  );
}
export default App;
