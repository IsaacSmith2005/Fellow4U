const mongoose = require('mongoose');

const FellowProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
  languages: {
    type: [String],
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  gallery: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FellowProfile', FellowProfileSchema);
