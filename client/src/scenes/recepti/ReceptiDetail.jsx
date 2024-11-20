import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import ApiConfig from '../../components/apiConfig';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import GroupIcon from '@mui/icons-material/Group';

import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from '@mui/icons-material/Delete';

const ReceptiDetail = () => {

  const [recipe, setRecipe] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {

    fetchRecipe();

  }, [id]);

  const fetchRecipe = async () => {

    try {

      setLoading(true);

      const response = await axios.get(`${ApiConfig.baseUrl}/api/recepti/${id}`);

      setRecipe(response.data);

      setError(null);

    } catch (err) {

      setError('Greška pri dohvaćanju recepta');

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async () => {

    if (window.confirm('Jeste li sigurni da želite obrisati ovaj recept?')) {

      try {

        await axios.delete(`${ApiConfig.baseUrl}/api/recepti/delete/${id}`);

        navigate('/recepti');

      } catch (err) {

        setError('Greška pri brisanju recepta');

        console.error(err);

      }

    }

  };

  if (loading) return <div className="recipe-loading">Učitavanje...</div>;

  if (error) return <div className="recipe-error">{error}</div>;

  if (!recipe) return <div className="recipe-error">Recept nije pronađen</div>;

  return (

    <div className="recipe-detail">

      <button className="back-button" onClick={() => navigate('/recepti')}>

        &larr; Back

      </button>

      <div className="recipe-detail-header">

        <h1 className="recipe-detail-title">{recipe.name}</h1>

        <div className="recipe-detail-actions">

          <button

            onClick={() => navigate(`/recepti/edit/${id}`)}

            className="recipe-button recipe-button-secondary"

          >

            <EditIcon /> Uredi

          </button>

          <button

            onClick={handleDelete}

            className="recipe-button recipe-button-danger"

          >

            <DeleteIcon /> Obriši

          </button>

        </div>

      </div>

      <div className="recipe-detail-meta">

        <span className="recipe-time">

          <AccessTimeIcon />

          {recipe.cookingTime} minuta

        </span>

        <span className="recipe-servings">

          <GroupIcon />

          {recipe.servings} osoba

        </span>

      </div>

      <div className="recipe-detail-section">

        <h2>Sastojci</h2>

        <div className="recipe-ingredients">

          {recipe.ingredients.split('\n').map((ingredient, index) => (

            <div key={index} className="recipe-ingredient-item">

              {ingredient}

            </div>

          ))}

        </div>

      </div>

      <div className="recipe-detail-section">

        <h2>Upute za pripremu</h2>

        <div className="recipe-instructions">

          {recipe.steps.split('\n').map((step, index) => (

            <div key={index} className="recipe-instruction-step">

              <span className="step-number">{index + 1}.</span>

              <span className="step-text">{step}</span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default ReceptiDetail;
