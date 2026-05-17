const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg'
  },
  images: {
    type: [String],
    default: []
  },
  departurePlace: {
    type: String,
    required: [true, 'Please add departure place']
  },
  duration: {
    type: String,
    required: [true, 'Please add duration']
  },
  priceAdult: {
    type: Number,
    required: [true, 'Please add adult price']
  },
  priceChild: {
    type: Number,
    required: [true, 'Please add child price']
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
  likes: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Phương thức tĩnh để tính toán rating trung bình và số lượng đánh giá
TourSchema.statics.getAverageRating = async function(tourId) {
  const obj = await mongoose.model('Review').aggregate([
    {
      $match: { targetId: tourId, targetType: 'tour' }
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
      await this.findByIdAndUpdate(tourId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.findByIdAndUpdate(tourId, {
        rating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Tour', TourSchema);