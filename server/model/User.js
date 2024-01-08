const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  korisnickoIme: String,
  password: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  ime: String,
  prezime: String,
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: false },
  isStudent: { type: Boolean, default: false },
  oib: { type: String, required: true, unique: true },
  program: String,
  brojMobitela: String,
  mentor: String,
  datumRodjenja: Date,
  adresa: {
    ulica: String,
    kucniBroj: String,
    mjesto: String,
  },
  pohadjaTeoriju: Boolean,
  napomene: { type: [String], default: [] },
  maloljetniClan: Boolean,
  roditelj1: {
    ime: String,
    prezime: String,
    brojMobitela: String,
  },
  roditelj2: {
    ime: String,
    prezime: String,
    brojMobitela: String,
  },
  rasporedId: String,
  rasporedTeorijaId: String,
},
{timestamps: true }
);

module.exports = mongoose.model('User', userSchema);