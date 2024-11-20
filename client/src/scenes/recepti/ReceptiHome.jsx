import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ReceptiHome = () => {
  const [recipes, setRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const recipesPerPage = 10;

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterAndPaginateRecipes();
  }, [recipes, searchTerm, searchType, page]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ApiConfig.baseUrl}/api/recepti`);
      setRecipes(response.data);
      setError(null);
    } catch (err) {
      setError('Greška pri dohvaćanju recepata');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => {
        if (searchType === 'name') {
          return recipe.name.toLowerCase().includes(searchLower);
        } else {
          return recipe.ingredients.toLowerCase().includes(searchLower);
        }
      });
    }

    const startIndex = 0;
    const endIndex = page * recipesPerPage;
    setDisplayedRecipes(filtered.slice(startIndex, endIndex));
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading) return <div className="recipe-loading">Učitavanje...</div>;
  if (error) return <div className="recipe-error">{error}</div>;

  return (
    <div className="container">
      <h1>Knjiga Recepata</h1>

      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Pretraži recepte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-filter">
            <label
              className={searchType === 'name' ? 'active' : ''}
              title="Pretraži po nazivu"
            >
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'name'}
                onChange={() => setSearchType('name')}
              />
              <TextFieldsIcon />
            </label>
            <label
              className={searchType === 'ingredients' ? 'active' : ''}
              title="Pretraži po sastojcima"
            >
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'ingredients'}
                onChange={() => setSearchType('ingredients')}
              />
              <FormatListBulletedIcon />
            </label>
          </div>
        </div>

        <Link to="/recepti/add" className="add-recipe-btn">
          <AddIcon /> Dodaj Novi Recept
        </Link>
      </div>

      <div className="recipe-list">
        {displayedRecipes.map((recipe) => (
          <Link to={`/recepti/${recipe._id}`} key={recipe._id} className="recipe-list-item">
            <div className="recipe-list-content">
              <h3>{recipe.name}</h3>
              <div className="recipe-meta">
                <span><AccessTimeIcon />{recipe.cookingTime} min</span>
                <span><GroupIcon />{recipe.servings} osoba</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {displayedRecipes.length < recipes.filter(r => {
        if (!searchTerm) return true;
        return searchType === 'name'
          ? r.name.toLowerCase().includes(searchTerm.toLowerCase())
          : r.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
      }).length && (
        <button className="load-more-btn" onClick={loadMore}>
          Učitaj još recepata
        </button>
      )}
    </div>
  );
};

export default ReceptiHome;