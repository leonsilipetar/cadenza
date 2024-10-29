const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Pretpostavljamo da postoji model User
    },
    amount: {
        type: Number,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    pdfPath: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
