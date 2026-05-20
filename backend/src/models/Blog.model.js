const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String },
  tags: [String],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Blog', BlogSchema);