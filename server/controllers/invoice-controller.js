const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const InvoiceModel = require('../model/Invoice');
const User = require('../model/User');
const Program = require('../model/Program');
const School = require('../model/School');

const addInvoice = async (req, res) => {
    try {
      const { studentIds, ...invoiceData } = req.body;
  
      // Create and save the invoice
      const newInvoice = new Invoice({ ...invoiceData, studentIds });
      await newInvoice.save();
  
      // Update student documents with the new invoice ID
      await User.updateMany(
        { _id: { $in: studentIds } },
        { $push: { racuni: newInvoice._id } }
      );
  
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(500).send('Error adding invoice');
    }
  };

const getUserInvoices = async (req, res) => {
  const { userId } = req.params;
  try {
    const invoices = await InvoiceModel.find({ studentId: userId })
      .populate('programId', 'naziv')
      .populate('schoolId', 'naziv')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
};

const generateInvoice = async (req, res) => {
  const { studentId, programId, month, year } = req.body;
  
  try {
    // Fetch all required data
    const student = await User.findById(studentId);
    const program = await Program.findById(programId);
    const school = await School.findById(program.skola);
    const mentor = await User.findOne({ _id: { $in: program.mentori } });

    if (!student || !program || !school || !mentor) {
      return res.status(404).json({ error: 'Required data not found' });
    }

    // Calculate due date (15 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    // Create invoice data
    const invoiceData = {
      studentId,
      mentorId: mentor._id,
      programId,
      schoolId: school._id,
      month,
      year,
      amount: program.cijena,
      dueDate,
      issueDate: new Date(),
      paymentDetails: {
        bankAccount: school.bankAccount || 'HR1234567890123456789',
        reference: `HR00-${studentId.substring(0, 6)}`,
      }
    };

    // Create and save invoice
    const invoice = new InvoiceModel(invoiceData);
    await invoice.save();

    // Update student's invoices array
    await User.findByIdAndUpdate(studentId, {
      $push: { racuni: invoice._id }
    });

    // Return full invoice data with populated references
    const populatedInvoice = await InvoiceModel.findById(invoice._id)
      .populate('studentId', 'ime prezime adresa oib')
      .populate('programId', 'naziv cijena')
      .populate('schoolId', 'naziv adresa oib bankAccount');

    res.status(201).json({
      invoice: populatedInvoice,
      student,
      program,
      school
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generating invoice' });
  }
};

const downloadInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const pdfPath = path.join(__dirname, `../invoices/${invoice.invoiceNumber}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    res.download(pdfPath, `Invoice-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ error: 'Error downloading invoice' });
  }
};

module.exports = {
  generateInvoice,
  getUserInvoices,
  downloadInvoice,
  addInvoice
};

