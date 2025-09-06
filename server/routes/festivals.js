const express = require('express');
const { body, validationResult } = require('express-validator');
const Festival = require('../models/Festival');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/festivals
// @desc    Get all festivals with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      district,
      featured,
      upcoming,
      search,
      limit = 20,
      page = 1,
      sort = 'date.start',
      order = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (district) filter.district = district;
    if (featured === 'true') filter.featured = true;
    if (upcoming === 'true') {
      filter['date.start'] = { $gte: new Date() };
    }
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
    const festivals = await Festival.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Festival.countDocuments(filter);

    res.json({
      festivals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get festivals error:', error);
    res.status(500).json({ message: 'Server error while fetching festivals' });
  }
});

// @route   GET /api/festivals/upcoming
// @desc    Get upcoming festivals
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const currentDate = new Date();

    const festivals = await Festival.find({
      isActive: true,
      'date.start': { $gte: currentDate }
    })
    .sort({ 'date.start': 1 })
    .limit(parseInt(limit));

    res.json({ festivals });
  } catch (error) {
    console.error('Get upcoming festivals error:', error);
    res.status(500).json({ message: 'Server error while fetching upcoming festivals' });
  }
});

// @route   GET /api/festivals/:id
// @desc    Get single festival by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);

    if (!festival || !festival.isActive) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json({ festival });
  } catch (error) {
    console.error('Get festival error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Festival not found' });
    }
    res.status(500).json({ message: 'Server error while fetching festival' });
  }
});

// @route   POST /api/festivals
// @desc    Create a new festival
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('shortDescription').trim().isLength({ min: 1, max: 300 }).withMessage('Short description is required and must be less than 300 characters'),
  body('date.start').isISO8601().withMessage('Valid start date is required'),
  body('date.end').isISO8601().withMessage('Valid end date is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates are required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.district').trim().notEmpty().withMessage('District is required'),
  body('category').isIn(['Religious', 'Cultural', 'Harvest', 'Seasonal', 'Traditional', 'Modern']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const festival = new Festival(req.body);
    await festival.save();

    res.status(201).json({
      message: 'Festival created successfully',
      festival
    });
  } catch (error) {
    console.error('Create festival error:', error);
    res.status(500).json({ message: 'Server error while creating festival' });
  }
});

// @route   PUT /api/festivals/:id
// @desc    Update a festival
// @access  Private (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const festival = await Festival.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json({
      message: 'Festival updated successfully',
      festival
    });
  } catch (error) {
    console.error('Update festival error:', error);
    res.status(500).json({ message: 'Server error while updating festival' });
  }
});

// @route   DELETE /api/festivals/:id
// @desc    Delete a festival
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const festival = await Festival.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json({ message: 'Festival deleted successfully' });
  } catch (error) {
    console.error('Delete festival error:', error);
    res.status(500).json({ message: 'Server error while deleting festival' });
  }
});

module.exports = router;
