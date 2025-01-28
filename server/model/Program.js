// models/program.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  naziv: { type: String, required: true },
  tipovi: [{
    tip: {
      type: String,
      required: true,
      enum: ['grupno', 'individualno1', 'individualno2', 'none']
    },
    cijena: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  mentori: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Povezivanje s mentorima
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Povezivanje s učenicima
  opis: { type: String },
  trajanje: { type: Number }, // Duration in minutes
  brojSati: { type: Number }, // Hours per month
}, { timestamps: true });

// Export only if model hasn't been compiled
module.exports = mongoose.models.Program || mongoose.model('Program', programSchema);
