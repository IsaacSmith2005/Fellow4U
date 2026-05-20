const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.ObjectId, ref: 'Blog', required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  parentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Comment', CommentSchema);