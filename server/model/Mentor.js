const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Mentor schema
const mentorSchema = new Schema({
  korisnickoIme: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  program: String,
  isAdmin: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: true },
  isStudent: { type: Boolean, default: false },
  oib: { type: String, required: true, unique: true },
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
    type: [String], // Define the type as an array of strings
    default: [],    // Provide a default empty array if needed
  },
  password: String,
  students: [
    {
      ucenikId: { type: Schema.Types.ObjectId, ref: 'User' },
      ime: String,
      prezime: String,
    }
  ],
});

// Create the Mentor model
const Mentor = mongoose.model('Mentor', mentorSchema);

// Export the Mentor model
module.exports = Mentor;
