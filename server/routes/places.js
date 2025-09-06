const express = require('express');
const { body, validationResult } = require('express-validator');
const Place = require('../models/Place');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/places
// @desc    Get all places with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      district,
      featured,
      search,
      limit = 20,
      page = 1,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (district) filter.district = district;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const places = await Place.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('nearbyPlaces', 'name location.coordinates');

    const total = await Place.countDocuments(filter);

    res.json({
      places,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: 'Server error while fetching places' });
  }
});

// @route   GET /api/places/nearby
// @desc    Get places near a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const places = await Place.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    }).limit(parseInt(limit));

    res.json({ places });
  } catch (error) {
    console.error('Get nearby places error:', error);
    res.status(500).json({ message: 'Server error while fetching nearby places' });
  }
});

// @route   GET /api/places/:id
// @desc    Get single place by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('nearbyPlaces', 'name location.coordinates images');

    if (!place || !place.isActive) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ place });
  } catch (error) {
    console.error('Get place error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(500).json({ message: 'Server error while fetching place' });
  }
});

// @route   POST /api/places
// @desc    Create a new place
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('shortDescription').trim().isLength({ min: 1, max: 300 }).withMessage('Short description is required and must be less than 300 characters'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates are required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.district').trim().notEmpty().withMessage('District is required'),
  body('category').isIn(['Historical', 'Religious', 'Natural', 'Cultural', 'Adventure', 'Wildlife', 'Architecture']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const place = new Place(req.body);
    await place.save();

    res.status(201).json({
      message: 'Place created successfully',
      place
    });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error while creating place' });
  }
});

// @route   PUT /api/places/:id
// @desc    Update a place
// @access  Private (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({
      message: 'Place updated successfully',
      place
    });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error while updating place' });
  }
});

// @route   DELETE /api/places/:id
// @desc    Delete a place
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error while deleting place' });
  }
});

module.exports = router;
