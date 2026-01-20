const Invoice = require('../models/Invoice');
const Cheque = require('../models/Cheque');

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ billDate: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get invoice by invoice number
const getInvoiceByNumber = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new invoice
const addInvoice = async (req, res) => {
  try {
    const { invoiceNumber, billDate, companyName, items, billAmount } = req.body;
    
    // Validate invoice number is provided
    if (!invoiceNumber || !invoiceNumber.trim()) {
      return res.status(400).json({ message: 'Invoice number is required' });
    }
    
    // Check if invoice number already exists
    const existing = await Invoice.findOne({ invoiceNumber: invoiceNumber.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }
    
    const invoice = new Invoice({
      invoiceNumber: invoiceNumber.trim(),
      billDate,
      companyName,
      items,
      billAmount
    });
    
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { billDate, companyName, items, billAmount } = req.body;
    
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Invoice number cannot be updated
    if (billDate) invoice.billDate = billDate;
    if (companyName) invoice.companyName = companyName;
    if (items) invoice.items = items;
    if (billAmount !== undefined) invoice.billAmount = billAmount;
    
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Check if any cheques are linked to this invoice
    const chequesCount = await Cheque.countDocuments({ invoiceNumber: req.params.invoiceNumber });
    if (chequesCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete invoice. ${chequesCount} cheque(s) are linked to this invoice.` 
      });
    }
    
    await Invoice.deleteOne({ invoiceNumber: req.params.invoiceNumber });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceByNumber,
  addInvoice,
  updateInvoice,
  deleteInvoice
};