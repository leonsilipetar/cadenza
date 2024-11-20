const Recipe = require('../model/Recipe');
const mongoose = require('mongoose');

// Get all recipes with optional filtering
const getAllRecipes = async (req, res) => {
  try {
    const { name, ingredients } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (ingredients) {
      query.ingredients = { $regex: ingredients, $options: 'i' };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri dohvaćanju recepata', error: error.message });
  }
};

// Get single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevažeći ID recepta' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recept nije pronađen' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Greška pri dohvaćanju recepta', error: error.message });
  }
};

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    // Count the current number of recipes
    const recipeCount = await Recipe.countDocuments();

    // Check if the limit of 400 recipes is reached
    if (recipeCount >= 400) {
      return res.status(403).json({ message: 'Recipe limit reached. Cannot add more recipes.' });
    }

    // Proceed to create a new recipe
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevažeći ID recepta' });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recept nije pronađen' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Greška pri ažuriranju recepta', error: error.message });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevažeći ID recepta' });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recept nije pronađen' });
    }

    res.status(200).json({ message: 'Recept uspješno obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri brisanju recepta', error: error.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};