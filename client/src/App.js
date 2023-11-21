import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Naslovna from "./scenes/naslovna/Naslovna";
import { authActions } from "./store/index.js";
import Profil from './scenes/Profile.jsx';
import Chat from './scenes/Chat.jsx';
import Racuni from './scenes/Racuni.jsx';
import Raspored from './scenes/Raspored.jsx';
import Admin from './scenes/administracija/Admin.jsx';
import Korisnici from './scenes/administracija/Korisnici.jsx';
import RacuniAdmin from './scenes/administracija/RacuniAdmin.jsx';

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (storedIsLoggedIn) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/signup") {
      window.location.href = "/login";
    }
  }, [isLoggedIn, location]);

  return (
    <Routes>
      {isLoggedIn && <Route path="/user/*" element={<Naslovna />} />}
      {isLoggedIn && <Route path="/profil/*" element={<Profil />} />}
      {isLoggedIn && <Route path="/chat" element={<Chat />} />}
      {isLoggedIn && <Route path="/racuni" element={<Racuni />} />}
      {isLoggedIn && <Route path="/raspored" element={<Raspored />} />}
      {isLoggedIn && <Route path="/admin" element={<Admin />} />}
      {isLoggedIn && <Route path="/korisnici" element={<Korisnici />} />}
      {isLoggedIn && <Route path="/racuni-admin" element={<RacuniAdmin />} />}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
