const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.ObjectId, required: true },
  targetType: { type: String, enum: ['guide', 'tour', 'experience'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Gọi getAverageRating sau khi lưu đánh giá
ReviewSchema.post('save', async function() {
  if (this.targetType === 'tour') {
    await this.constructor.model('Tour').getAverageRating(this.targetId);
  } else if (this.targetType === 'guide') {
    await this.constructor.model('GuideProfile').getAverageRating(this.targetId);
  } else if (this.targetType === 'experience') {
    await this.constructor.model('Experience').getAverageRating(this.targetId);
  }
});

// Gọi getAverageRating trước khi xóa
ReviewSchema.pre('deleteOne', { document: true, query: false }, async function() {
  if (this.targetType === 'tour') {
    await this.constructor.model('Tour').getAverageRating(this.targetId);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);