const Invoice = require('../model/Invoice');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new invoice
const createInvoice = asyncWrapper(async (req, res) => {
  const { userId, amount, description } = req.body;

  try {
    const newInvoice = await Invoice.create({
      userId,
      amount,
      description,
      date: new Date(),
    });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

// Get all invoices for a user
const getUserInvoices = asyncWrapper(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user

  try {
    const invoices = await Invoice.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });

    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Update an invoice
const updateInvoice = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    Object.assign(invoice, updateData);
    await invoice.save();

    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Error updating invoice' });
  }
});

// Delete an invoice
const deleteInvoice = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await Invoice.destroy({ where: { id } });
    res.status(200).json({ message: 'Invoice successfully deleted' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Error deleting invoice' });
  }
});

module.exports = {
  createInvoice,
  getUserInvoices,
  updateInvoice,
  deleteInvoice,
};

