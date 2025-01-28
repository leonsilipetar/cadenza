const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  korisnickoIme: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  program: [{ type: Schema.Types.ObjectId, ref: 'Program' }], // Reference na programe
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: true },
  isStudent: { type: Boolean, default: false },
  oib: { type: String, unique: true },
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  brojMobitela: { type: String },
  datumRodjenja: { type: Date },
  adresa: {
    ulica: { type: String },
    kucniBroj: { type: String },
    mjesto: { type: String },
  },
  napomene: {
    type: [String],
    default: [],
  },
  password: String,
  students: [
    {
      ucenikId: { type: Schema.Types.ObjectId, ref: 'User' },
      ime: String,
      prezime: String,
    }
  ],
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
