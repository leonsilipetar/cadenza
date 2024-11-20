import React from 'react';
import { useHistory } from 'react-router-dom';

const RecipeDetail = ({ recipe }) => {
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <div className="recipe-detail">
      <button className="back-button" onClick={handleBackClick}>
        &larr; Back
      </button>
      {/* ... existing recipe detail content ... */}
    </div>
  );
};

export default RecipeDetail; 