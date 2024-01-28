import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
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

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the cookie exists
    const cookieExists = document.cookie.includes('yourCookieNameHere');

    if (cookieExists) {
      // Log the user in
      dispatch(authActions.login());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [isLoggedIn, location, navigate]);

  return (
    <Routes>
      {isLoggedIn && <Route path="/user/*" element={<Naslovna />} />}
      {isLoggedIn && <Route path="/profil/*" element={<Profil />} />}
      {isLoggedIn && <Route path="/chat/*" element={<Chat />} />}
      {isLoggedIn && <Route path="/racuni/*" element={<Racuni />} />}
      {isLoggedIn && <Route path="/raspored/*" element={<Raspored />} />}
      {isLoggedIn && <Route path="/admin/*" element={<Admin />} />}
      {isLoggedIn && <Route path="/korisnici/*" element={<Korisnici />} />}
      {isLoggedIn && <Route path="/mentori/*" element={<Mentori />} />}
      {isLoggedIn && <Route path="/racuni-admin/*" element={<RacuniAdmin />} />}
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Login />} />
    </Routes>
  );
}

export default App;
