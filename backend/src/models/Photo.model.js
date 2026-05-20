const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: [true, 'Please add photo URL']
  },
  description: String,
  fileName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', PhotoSchema);