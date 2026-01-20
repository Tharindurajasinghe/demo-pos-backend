const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getAllCheques,
  getChequeById,
  getChequesByInvoice,
  addCheque,
  updateCheque,
  deleteCheque
} = require('../controllers/chequeController');

// All routes need authentication
router.use(authenticateToken);

router.get('/', getAllCheques);
router.get('/invoice/:invoiceNumber', getChequesByInvoice);
router.get('/:id', getChequeById);
router.post('/', addCheque);
router.put('/:id', updateCheque);
router.delete('/:id', deleteCheque);

module.exports = router;