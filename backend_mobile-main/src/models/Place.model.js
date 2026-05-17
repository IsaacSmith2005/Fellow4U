const mongoose = require('mongoose');
const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  location: {
    lat: Number,
    lng: Number
  },
  city: { type: String },
  category: { type: String }
});
module.exports = mongoose.model('Place', PlaceSchema);