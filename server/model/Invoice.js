const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceNumber: { 
        type: String, 
        required: true,
        unique: true 
    },
    studentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mentorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    programId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Program', 
        required: true 
    },
    schoolId: { 
        type: Schema.Types.ObjectId, 
        ref: 'School', 
        required: true 
    },
    month: { 
        type: String, 
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['draft', 'sent', 'paid', 'cancelled'],
        default: 'draft'
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    paymentDetails: {
        bankAccount: String,
        reference: String,
        qrCode: String
    },
    notes: String
}, { timestamps: true });

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
    if (this.isNew) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        
        // Find the last invoice number for the current year/month
        const lastInvoice = await this.constructor.findOne({
            invoiceNumber: new RegExp(`^${year}${month}`)
        }).sort({ invoiceNumber: -1 });
        
        let sequence = '001';
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-3));
            sequence = String(lastSequence + 1).padStart(3, '0');
        }
        
        this.invoiceNumber = `${year}${month}${sequence}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
