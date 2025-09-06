const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: function() {
      return !this.festival;
    }
  },
  festival: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Festival',
    required: function() {
      return !this.place;
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure either place or festival is provided, but not both (skip for public reviews)
reviewSchema.pre('validate', function(next) {
  // Skip validation for public reviews
  if (this.isPublic) {
    return next();
  }
  
  if (!this.place && !this.festival) {
    return next(new Error('Either place or festival must be specified'));
  }
  if (this.place && this.festival) {
    return next(new Error('Cannot specify both place and festival'));
  }
  next();
});

// Index for efficient queries
reviewSchema.index({ place: 1, createdAt: -1 });
reviewSchema.index({ festival: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
