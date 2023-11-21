const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  korisnickoIme: String,
  password: String,
  email: String,
  ime: String,
  prezime: String,
  isAdmin: Boolean,
  isMentor: Boolean,
  isStudent: Boolean,
  oib: String,
  class: String,
},
{timestamps: true }
);

module.exports = mongoose.model('User', userSchema);