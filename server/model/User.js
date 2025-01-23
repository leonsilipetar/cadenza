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
  isStudent: { type: Boolean, default: true },
  oib: { type: String, unique: true },
  brojMobitela: String,
  datumRodjenja: Date,
  adresa: {
    ulica: String,
    kucniBroj: String,
    mjesto: String,
  },
  pohadjaTeoriju: Boolean,
  program: [{ type: Schema.Types.ObjectId, ref: 'Program' }], // Reference na programe
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
  mentors: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
  }],
  rasporedId: {
    type: Schema.Types.ObjectId,
    ref: 'Raspored',
  },
  rasporedTeorijaId: {
    type: Schema.Types.ObjectId,
    ref: 'Raspored',
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  racuni: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  fcmTokens: [String]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
