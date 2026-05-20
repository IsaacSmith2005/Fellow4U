const mongoose = require('mongoose');
const TripDestinationSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.ObjectId, ref: 'Trip', required: true },
  place: { type: mongoose.Schema.ObjectId, ref: 'Place', required: true }
});
module.exports = mongoose.model('TripDestination', TripDestinationSchema);