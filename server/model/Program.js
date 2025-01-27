// models/program.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  naziv: { type: String, required: true },
  cijena: { type: Number, required: true }, // Osnovna cijena
  tip: { type: String, enum: ['grupno', 'individualno1', 'individualno2'], required: true }, // Vrsta tečaja
  skola: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  mentori: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Povezivanje s mentorima
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Povezivanje s učenicima
  opis: { type: String },
  trajanje: { type: Number }, // Duration in minutes
  brojSati: { type: Number }, // Hours per month
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
