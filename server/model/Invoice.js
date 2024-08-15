// models/invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  invoiceNumber: String,
  date: Date,
  items: [{ description: String, amount: Number }],
  total: Number,
  status: String, // e.g., 'Paid', 'Unpaid'
  studentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Reference to users
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
