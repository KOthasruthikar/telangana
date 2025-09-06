const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
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
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && 
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
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
    enum: ['Historical', 'Religious', 'Natural', 'Cultural', 'Adventure', 'Wildlife', 'Architecture']
  },
  bestTimeToVisit: {
    type: String,
    required: [true, 'Best time to visit is required']
  },
  entryFee: {
    type: String,
    default: 'Free'
  },
  timings: {
    type: String,
    default: '24/7'
  },
  facilities: [{
    type: String
  }],
  nearbyPlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
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
placeSchema.index({ 'location': '2dsphere' });

// Virtual for primary image
placeSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : '');
});

// Ensure virtual fields are serialized
placeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Place', placeSchema);
