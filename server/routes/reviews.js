const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Place = require('../models/Place');
const Festival = require('../models/Festival');
const { auth } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Email service is now handled by emailService.js

// @route   GET /api/reviews
// @desc    Get all reviews with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      place,
      festival,
      user,
      rating,
      limit = 20,
      page = 1,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (place) filter.place = place;
    if (festival) filter.festival = festival;
    if (user) filter.user = user;
    if (rating) filter.rating = parseInt(rating);

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .populate('place', 'name')
      .populate('festival', 'name')
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('place', 'name')
      .populate('festival', 'name');

    if (!review || !review.isActive) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    console.error('Get review error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error while fetching review' });
  }
});

// @route   POST /api/reviews/public
// @desc    Create a public review (from contact form)
// @access  Public
router.post('/public', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment is required and must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, rating, title, comment, place, festival } = req.body;

    // Create and save review to database
    const review = new Review({
      name,
      email,
      rating,
      title,
      comment,
      place: place || null,
      festival: festival || null,
      isPublic: true,
      isActive: true
    });

    await review.save();
    console.log('✅ Review saved to database:', review._id);

    // Send email notification
    try {
      await emailService.sendReviewEmail({
        name,
        email,
        rating,
        title,
        comment,
        place: place || 'Not specified',
        festival: festival || 'Not specified'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      message: 'Review submitted successfully. Thank you for your feedback!',
      review: {
        id: review._id,
        name,
        email,
        rating,
        title,
        comment
      }
    });
  } catch (error) {
    console.error('Error creating public review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment is required and must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { place, festival, rating, title, comment, images } = req.body;

    // Validate that either place or festival is provided
    if (!place && !festival) {
      return res.status(400).json({ message: 'Either place or festival must be specified' });
    }

    if (place && festival) {
      return res.status(400).json({ message: 'Cannot specify both place and festival' });
    }

    // Check if place/festival exists
    if (place) {
      const placeExists = await Place.findById(place);
      if (!placeExists) {
        return res.status(404).json({ message: 'Place not found' });
      }
    }

    if (festival) {
      const festivalExists = await Festival.findById(festival);
      if (!festivalExists) {
        return res.status(404).json({ message: 'Festival not found' });
      }
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      place,
      festival,
      rating,
      title,
      comment,
      images: images || []
    });

    await review.save();

    // Populate the review for response
    await review.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'place', select: 'name' },
      { path: 'festival', select: 'name' }
    ]);

    // Update place/festival rating
    if (place) {
      await updatePlaceRating(place);
    } else if (festival) {
      await updateFestivalRating(festival);
    }

    // Send email notification
    try {
      await sendReviewEmail(review);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('comment').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name avatar' },
      { path: 'place', select: 'name' },
      { path: 'festival', select: 'name' }
    ]);

    // Update place/festival rating if rating changed
    if (req.body.rating && (review.place || review.festival)) {
      if (review.place) {
        await updatePlaceRating(review.place);
      } else if (review.festival) {
        await updateFestivalRating(review.festival);
      }
    }

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error while updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndUpdate(req.params.id, { isActive: false });

    // Update place/festival rating
    if (review.place) {
      await updatePlaceRating(review.place);
    } else if (review.festival) {
      await updateFestivalRating(review.festival);
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
});

// Helper function to update place rating
async function updatePlaceRating(placeId) {
  const reviews = await Review.find({ place: placeId, isActive: true });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await Place.findByIdAndUpdate(placeId, {
    'rating.average': Math.round(averageRating * 10) / 10,
    'rating.count': reviews.length
  });
}

// Helper function to update festival rating
async function updateFestivalRating(festivalId) {
  const reviews = await Review.find({ festival: festivalId, isActive: true });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await Festival.findByIdAndUpdate(festivalId, {
    'rating.average': Math.round(averageRating * 10) / 10,
    'rating.count': reviews.length
  });
}

// Helper function to send review email
async function sendReviewEmail(review) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email configuration not set, skipping email notification');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Review: ${review.title}`,
    html: `
      <h2>New Review Received</h2>
      <p><strong>Title:</strong> ${review.title}</p>
      <p><strong>Rating:</strong> ${review.rating}/5</p>
      <p><strong>Comment:</strong> ${review.comment}</p>
      <p><strong>User:</strong> ${review.user.name}</p>
      <p><strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}</p>
      ${review.place ? `<p><strong>Place:</strong> ${review.place.name}</p>` : ''}
      ${review.festival ? `<p><strong>Festival:</strong> ${review.festival.name}</p>` : ''}
    `
  };

  await transporter.sendMail(mailOptions);
}

// Function to send public review email
async function sendPublicReviewEmail(reviewData) {
  // Always try to send email, even without proper config
  console.log('📧 Sending review email to: kothasruthikarreddy11@gmail.com');
  console.log('Review data:', reviewData);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'kothasruthikarreddy11@gmail.com', // Your email address
    subject: `New Public Review: ${reviewData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          New Review Received from Telangana Tourism Website
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">Review Details</h3>
          <p><strong>Name:</strong> ${reviewData.name}</p>
          <p><strong>Email:</strong> ${reviewData.email}</p>
          <p><strong>Title:</strong> ${reviewData.title}</p>
          <p><strong>Rating:</strong> ${reviewData.rating}/5 ⭐</p>
          <p><strong>Comment:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
            ${reviewData.comment}
          </div>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${reviewData.place ? `<p><strong>Place:</strong> ${reviewData.place}</p>` : ''}
          ${reviewData.festival ? `<p><strong>Festival:</strong> ${reviewData.festival}</p>` : ''}
        </div>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0066cc;">
            <strong>Note:</strong> This review was submitted through the public contact form on the Telangana Tourism website.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This email was sent from the Telangana Tourism website contact form.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;
