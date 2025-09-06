const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Festival name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot be more than 300 characters']
  },
  date: {
    start: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Religious', 'Cultural', 'Harvest', 'Seasonal', 'Traditional', 'Modern']
  },
  significance: {
    type: String,
    required: [true, 'Significance is required']
  },
  rituals: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  specialAttractions: [{
    type: String
  }],
  entryFee: {
    type: String,
    default: 'Free'
  },
  timings: {
    type: String,
    default: 'All day'
  },
  contactInfo: {
    organizer: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create geospatial index
festivalSchema.index({ 'location': '2dsphere' });

// Virtual for primary image
festivalSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : '');
});

// Virtual for duration in days
festivalSchema.virtual('duration').get(function() {
  const start = new Date(this.date.start);
  const end = new Date(this.date.end);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

// Ensure virtual fields are serialized
festivalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Festival', festivalSchema);
