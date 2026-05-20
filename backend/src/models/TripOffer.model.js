const mongoose = require('mongoose');
const TripOfferSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.ObjectId, ref: 'Trip', required: true },
  guide: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  offeredRate: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});
module.exports = mongoose.model('TripOffer', TripOfferSchema);