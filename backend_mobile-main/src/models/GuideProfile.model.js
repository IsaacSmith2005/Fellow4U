const mongoose = require('mongoose');

const GuideProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  languages: {
    type: [String],
    default: []
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  toursCount: {
    type: Number,
    default: 0
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add price per day']
  }
}, {
  timestamps: true
});

// Phương thức tĩnh để tính toán rating trung bình cho Guide
GuideProfileSchema.statics.getAverageRating = async function(guideId) {
  const obj = await mongoose.model('Review').aggregate([
    {
      $match: { targetId: guideId, targetType: 'guide' }
    },
    {
      $group: {
        _id: '$targetId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.findOneAndUpdate({ user: guideId }, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.findOneAndUpdate({ user: guideId }, {
        rating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('GuideProfile', GuideProfileSchema);