const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('pdf-creator-node');
const InvoiceModel = require('../model/Invoice.js');
const User = require('../model/User.js');
const Program = require('../model/Program');
const PDFDocument = require('pdfkit');

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
        const invoices = await InvoiceModel.find({ userId });
        return res.json(invoices);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching invoices' });
    }
};



const generateInvoice = async (req, res) => {
  const { month } = req.body; // Mesec iz zahteva

  try {
    // Pronađi sve korisnike koji su studenti
    const students = await User.find({ isStudent: true });

    const invoices = [];
    for (const student of students) {
      const amount = 60;
      const details = `Račun za mesec ${month}`;
      const invoicePath = `./invoices/${student._id}_invoice_${month}.pdf`; // Putanja za PDF

      // Generiši PDF
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(invoicePath);
      doc.pipe(writeStream);
      doc.fontSize(25).text('Invoice', { align: 'center' });
      doc.text(`User ID: ${student._id}`);
      doc.text(`Amount: ${amount}`);
      doc.text(`Details: ${details}`);
      doc.end();

      // Sačekaj da se PDF završi
      await new Promise((resolve) => writeStream.on('finish', resolve));

      // Sačuvaj račun u bazu podataka
      const invoice = new InvoiceModel({
        userId: student._id,
        amount,
        details,
        pdfPath: invoicePath,
      });
      await invoice.save();
      invoices.push(invoice);
    }

    return res.status(201).json(invoices);
  } catch (error) {
    return res.status(500).json({ error: 'Greška pri generisanju računa.' });
  }
};


const downloadInvoice = async (req, res) => {
  const { id } = req.params;

  try {
      // Pretpostavimo da generiramo PDF na zahtjev
      const pdfPath = path.resolve(`./invoices/${id}.pdf`); // Privremena pohrana PDF-a

      if (!fs.existsSync(pdfPath)) {
          // Generiraj PDF ako ne postoji
          await generateInvoice(id); // Funkcija koja generira PDF na osnovu `id`
      }

      res.download(pdfPath, 'racun.pdf');
  } catch (error) {
      console.error('Error downloading invoice:', error);
      res.status(500).send('Error downloading invoice');
  }
};

exports.downloadInvoice = downloadInvoice ;
exports.generateInvoice =  generateInvoice ;
exports.addInvoice = addInvoice ;

