const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
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
  duration: {
    type: String,
    required: [true, 'Please add duration']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  // Liên kết tới Place
  place: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  // Liên kết tới User (role=guide)
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Phương thức tĩnh để tính toán rating trung bình cho Experience
ExperienceSchema.statics.getAverageRating = async function(experienceId) {
  const obj = await mongoose.model('Review').aggregate([
    {
      $match: { targetId: experienceId, targetType: 'experience' }
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
      await this.findByIdAndUpdate(experienceId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.findByIdAndUpdate(experienceId, {
        rating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Experience', ExperienceSchema);