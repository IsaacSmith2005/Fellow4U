const mongoose = require('mongoose');
const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.ObjectId, required: true },
  targetType: { type: String, enum: ['guide', 'tour'], required: true }
});
module.exports = mongoose.model('Wishlist', WishlistSchema);