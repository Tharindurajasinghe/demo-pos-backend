const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  billDate: {
    type: Date,
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    itemName: String,
    quantity: Number,
    pricePerItem: Number,
    total: Number
  }],
  billAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);