const InvoiceSettings = require('../models/InvoiceSettings');

// Get invoice settings
const getInvoiceSettings = async (req, res) => {
  try {
    const settings = await InvoiceSettings.findOne({ school: req.user.school });
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create or update invoice settings
const updateInvoiceSettings = async (req, res) => {
  try {
    const {
      nazivObrta,
      oib,
      iban,
      brojRacuna,
      adresa,
      dodatneInformacije
    } = req.body;

    const settings = await InvoiceSettings.findOneAndUpdate(
      { school: req.user.school },
      {
        nazivObrta,
        oib,
        iban,
        brojRacuna,
        adresa,
        dodatneInformacije,
        school: req.user.school
      },
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getInvoiceSettings,
  updateInvoiceSettings
}; 