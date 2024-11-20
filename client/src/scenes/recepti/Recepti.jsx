import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReceptiHome from './ReceptiHome';
import ReceptiDetail from './ReceptiDetail';
import ReceptForm from './ReceptForm';
import ReceptiNav from './ReceptiNav';
import './recipe.css';

const Recepti = () => {
  return (
    <div className="recipe-app">
      <div className="recipe-content">
        <Routes>
          <Route path="/" element={<ReceptiHome />} />
          <Route path="/search" element={<ReceptiHome />} />
          <Route path="/add" element={<ReceptForm />} />
          <Route path="/edit/:id" element={<ReceptForm isEditing={true} />} />
          <Route path="/:id" element={<ReceptiDetail />} />
          <Route path="/favorites" element={<ReceptiHome favorites={true} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Recepti; 