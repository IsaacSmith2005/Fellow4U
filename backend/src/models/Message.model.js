const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'voice'], default: 'text' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);