const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const invoiceController = require('../controllers/invoice-controller');

// Invoice routes
router.post('/upload-pdf-invoice', upload.single('pdfFile'), invoiceController.uploadPdfInvoice);
router.get('/user/:userId', invoiceController.getUserInvoices);
// ... other routes

module.exports = router; 