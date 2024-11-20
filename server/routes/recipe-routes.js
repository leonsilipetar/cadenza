const express = require('express');
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipe-controller');

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/add', createRecipe);
router.put('/edit/:id', updateRecipe);
router.delete('/delete/:id', deleteRecipe);

module.exports = router;