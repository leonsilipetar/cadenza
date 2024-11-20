import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
const ReceptForm = ({ isEditing }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    steps: '',
    cookingTime: '',
    servings: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditing && id) {
      fetchRecipe();
    }
  }, [id, isEditing]);
  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ApiConfig.baseUrl}/api/recepti/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Greška pri dohvaćanju recepta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`${ApiConfig.baseUrl}/api/recepti/edit/${id}`, formData);
      } else {
        await axios.post(`${ApiConfig.baseUrl}/api/recepti/add`, formData);
      }
      navigate('/recepti');
    } catch (err) {
      setError('Greška pri spremanju recepta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  if (loading) return <div className="loading-spinner">Učitavanje...</div>;
  return (
    <div className="recipe-form-wrapper">
      <div className="recipe-form-header">
        <button
          className="back-button"
          onClick={() => navigate('/recepti')}
        >
          <ArrowBackIcon /> Natrag
        </button>
        <h1>{isEditing ? 'Uredi Recept' : 'Novi Recept'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section basic-info">
          <div className="input-group">
            <label htmlFor="name">
              <MenuBookIcon /> Naziv Recepta
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Npr. Čokoladna torta"
              className="primary-input form-row"
            />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="cookingTime">
                <TimerIcon /> Vrijeme Pripreme
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="cookingTime"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="45"
                  className="primary-input"
                />
              </div>
                </div>
                <div className="input-group">
              <label htmlFor="servings">
                <GroupIcon /> Broj Porcija
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="4"
                  className="primary-input"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-section recipe-details">
          <div className="form-row">
            <div className="input-group ingredients-group">
              <label htmlFor="ingredients">
                <ListAltIcon /> Sastojci
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                placeholder="200g brašna&#10;2 jaja&#10;100g šećera"
                rows="12"
                className="primary-input"
              />
              <span className="input-help">Unesite jedan sastojak po retku</span>
            </div>
            <div className="input-group steps-group">
              <label htmlFor="steps">
                <MenuBookIcon /> Koraci Pripreme
              </label>
              <textarea
                id="steps"
                name="steps"
                value={formData.steps}
                onChange={handleChange}
                required
                placeholder="1. Zagrijte pećnicu na 180°C&#10;2. Pomiješajte suhe sastojke&#10;3. Dodajte mokre sastojke"
                rows="12"
                className="primary-input"
              />
              <span className="input-help">Unesite jedan korak po retku</span>
            </div>
          </div>
        </div>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={() => navigate('/recepti')}>
            Odustani
          </button>
          <button type="submit" className="btn primary">
            {isEditing ? 'Spremi Promjene' : 'Dodaj Recept'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ReceptForm;
