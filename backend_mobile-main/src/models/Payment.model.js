const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.ObjectId, ref: 'Trip' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String },
  transactionId: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Payment', PaymentSchema);