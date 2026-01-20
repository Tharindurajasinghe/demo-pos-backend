const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getAllInvoices,
  getInvoiceByNumber,
  addInvoice,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoiceController');

// All routes need authentication
router.use(authenticateToken);

router.get('/', getAllInvoices);
router.get('/:invoiceNumber', getInvoiceByNumber);
router.post('/', addInvoice);
router.put('/:invoiceNumber', updateInvoice);
router.delete('/:invoiceNumber', deleteInvoice);

module.exports = router;