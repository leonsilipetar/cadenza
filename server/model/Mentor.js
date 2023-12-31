const mongoose = require('mongoose');

// Define the Mentor schema
const mentorSchema = new mongoose.Schema({
  korisnickoIme: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: true },
  isStudent: { type: Boolean, default: false },
  oib: { type: String, required: true, unique: true },
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  brojMobitela: { type: String },
  mentor: { type: String }, // Assuming mentor is another user, replace String with the actual type
  datumRodjenja: { type: Date },
  adresa: {
    ulica: { type: String },
    kucniBroj: { type: String },
    mjesto: { type: String },
  },
  napomene: { type: String },
  password: { type: String, required: true },
});

// Create the Mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);

// Export the Mentor model
module.exports = Mentor;
