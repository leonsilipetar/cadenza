import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ReceptiNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="recipe-header">
      <div className="recipe-brand">
        <h1>Cookbook</h1>
      </div>
      <nav className="recipe-nav">
        <Link to="/recepti" className={`recipe-nav-item ${isActive('/recepti') ? 'active' : ''}`}>
          <HomeIcon />
          <span>Home</span>
        </Link>
        
        <Link to="/recepti/search" className={`recipe-nav-item ${isActive('/recepti/search') ? 'active' : ''}`}>
          <SearchIcon />
          <span>Search</span>
        </Link>

        <Link to="/recepti/add" className={`recipe-nav-item ${isActive('/recepti/add') ? 'active' : ''}`}>
          <AddIcon />
          <span>Add Recipe</span>
        </Link>

        <Link to="/recepti/favorites" className={`recipe-nav-item ${isActive('/recepti/favorites') ? 'active' : ''}`}>
          <FavoriteIcon />
          <span>Favorites</span>
        </Link>
      </nav>
    </div>
  );
};

export default ReceptiNav; 