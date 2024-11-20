const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naziv recepta je obavezan'],
    trim: true
  },
  ingredients: {
    type: String,
    required: [true, 'Sastojci su obavezni'],
    trim: true
  },
  steps: {
    type: String,
    required: [true, 'Upute su obavezne'],
    trim: true
  },
  cookingTime: {
    type: Number,
    min: [1, 'Vrijeme kuhanja mora biti barem 1 minuta']
  },
  servings: {
    type: Number,
    min: [1, 'Broj porcija mora biti barem 1']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);