const Cheque = require('../models/Cheque');
const Invoice = require('../models/Invoice');

// Get all cheques
const getAllCheques = async (req, res) => {
  try {
    const cheques = await Cheque.find().sort({ chequeDate: -1 });
    res.json(cheques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cheque by ID
const getChequeById = async (req, res) => {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ message: 'Cheque not found' });
    }
    res.json(cheque);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cheques by invoice number
const getChequesByInvoice = async (req, res) => {
  try {
    const cheques = await Cheque.find({ invoiceNumber: req.params.invoiceNumber });
    res.json(cheques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new cheque
const addCheque = async (req, res) => {
  try {
    const { invoiceNumber, billingDate, chequeNumber, chequeDate, chequeAmount } = req.body;
    
    // Verify invoice exists
    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res.status(400).json({ message: 'Invoice not found' });
    }
    
    // Check if cheque number already exists
    const existing = await Cheque.findOne({ chequeNumber });
    if (existing) {
      return res.status(400).json({ message: 'Cheque number already exists' });
    }
    
    const cheque = new Cheque({
      invoiceNumber,
      billingDate,
      chequeNumber,
      chequeDate,
      chequeAmount
    });
    
    const newCheque = await cheque.save();
    res.status(201).json(newCheque);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update cheque
const updateCheque = async (req, res) => {
  try {
    const { invoiceNumber, billingDate, chequeNumber, chequeDate, chequeAmount } = req.body;
    
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ message: 'Cheque not found' });
    }
    
    if (invoiceNumber) {
      const invoice = await Invoice.findOne({ invoiceNumber });
      if (!invoice) {
        return res.status(400).json({ message: 'Invoice not found' });
      }
      cheque.invoiceNumber = invoiceNumber;
    }
    
    if (billingDate) cheque.billingDate = billingDate;
    if (chequeNumber) {
      // Check if new cheque number already exists
      const existing = await Cheque.findOne({ 
        chequeNumber, 
        _id: { $ne: req.params.id } 
      });
      if (existing) {
        return res.status(400).json({ message: 'Cheque number already exists' });
      }
      cheque.chequeNumber = chequeNumber;
    }
    if (chequeDate) cheque.chequeDate = chequeDate;
    if (chequeAmount !== undefined) cheque.chequeAmount = chequeAmount;
    
    const updatedCheque = await cheque.save();
    res.json(updatedCheque);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete cheque
const deleteCheque = async (req, res) => {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ message: 'Cheque not found' });
    }
    
    await Cheque.deleteOne({ _id: req.params.id });
    res.json({ message: 'Cheque deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCheques,
  getChequeById,
  getChequesByInvoice,
  addCheque,
  updateCheque,
  deleteCheque
};