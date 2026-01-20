const mongoose = require('mongoose');

const chequeSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    ref: 'Invoice'
  },
  billingDate: {
    type: Date,
    required: true
  },
  chequeNumber: {
    type: String,
    required: true,
    unique: true
  },
  chequeDate: {
    type: Date,
    required: true
  },
  chequeAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Cheque', chequeSchema);