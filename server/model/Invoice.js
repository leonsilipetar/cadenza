const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceNumber: { 
        type: String, 
        required: true,
        unique: true 
    },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    programId: { type: Schema.Types.ObjectId, ref: 'Program' },
    schoolId: { 
        type: Schema.Types.ObjectId, 
        ref: 'School', 
        required: true 
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number },
    status: { 
        type: String, 
        enum: ['draft', 'sent', 'paid', 'cancelled'],
        default: 'draft'
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    issueDate: { type: Date, default: Date.now },
    programType: String,
    paymentDetails: {
        bankAccount: String,
        reference: String,
        qrCode: String
    },
    notes: String,
    pdfData: {
        data: Buffer,
        contentType: String,
        originalName: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
