import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

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

      if (location.pathname === '/') {

        navigate('/user');

      }

    }

  }, [dispatch, location.pathname, navigate]);

  useEffect(() => {

    if (location.pathname.startsWith('/recepti')) {

      return;

    }

    if (!isLoggedIn && location.pathname !== '/' && location.pathname !== '/login') {

      navigate('/');

    }

    if (isLoggedIn && location.pathname === '/') {

      navigate('/user');

    }

  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {

    const interval = setInterval(() => {

      axios.post(`${ApiConfig.baseUrl}/api/refresh`, {}, { withCredentials: true })

        .then((response) => {

          // Handle the new access token here if needed

        })

        .catch((error) => {

          console.error("Failed to refresh token", error);

          dispatch(authActions.logout());

          navigate('/');

        });

    }, 50 * 1000); // 50 seconds

    return () => clearInterval(interval); // Clear interval on component unmount

  }, [dispatch, navigate]);

  return (

    <Routes>

      <Route path="/recepti/*" element={<Recepti />} />

      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/user" />} />

      <Route path="/" element={isLoggedIn ? <Navigate to="/user" /> : <Welcome />} />



      {/* Protected Routes */}

      {isLoggedIn && (

        <>

          <Route path="/user/*" element={<Naslovna />} />

          <Route path="/profil/*" element={<Profil />} />

          <Route path="/chat/*" element={<Chat />} />

          <Route path="/racuni/*" element={<Racuni />} />

          <Route path="/raspored/*" element={<Raspored />} />

          <Route path="/admin/*" element={<Admin />} />

          <Route path="/korisnici/*" element={<Korisnici />} />

          <Route path="/mentori/*" element={<Mentori />} />

          <Route path="/racuni-admin/*" element={<RacuniAdmin />} />

          <Route path="/classrooms/*" element={<Classroom />} />

        </>

      )}



      {/* Catch-all route - exclude recipes from the redirect */}

      <Route path="*" element={

        location.pathname.startsWith('/recepti') ? 

          <Recepti /> : 

          (isLoggedIn ? <Navigate to="/user" /> : <Welcome />)

      } />

    </Routes>

  );

}

export default App;


