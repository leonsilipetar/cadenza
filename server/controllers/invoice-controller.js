const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('pdf-creator-node');
const Invoice = require('../model/Invoice.js');
const User = require('../model/User.js');

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

const generateInvoice = async (req, res) => {
    try {
        // Retrieve student data from the request body
        const invoiceData = req.body;

        // Read HTML template
        const templatePath = path.join(__dirname, '..', 'templates', 'invoice-template.html');
        const template = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(template);
        const html = compiledTemplate(invoiceData);

        // PDF options
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        // PDF document definition
        const document = {
            html: html,
            data: invoiceData,
            path: './invoice.pdf',
            type: '',
        };

        // Generate PDF
        await pdf.create(document, options);

        // Send the PDF as a response
        res.sendFile(path.resolve(document.path));
    } catch (error) {
        res.status(500).send('Error generating invoice');
    }
};

exports.generateInvoice =  generateInvoice ;
exports.addInvoice = addInvoice ;

