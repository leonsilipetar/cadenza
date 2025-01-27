const express = require('express');
const router = express.Router();
const { 
  getInvoiceSettings, 
  updateInvoiceSettings 
} = require('../controllers/invoiceSettingsController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get invoice settings
router.get('/invoice-settings', getInvoiceSettings);

// Create or update invoice settings (admin only)
router.post('/invoice-settings', requireAdmin, updateInvoiceSettings);

module.exports = router; 