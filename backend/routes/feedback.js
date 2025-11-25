import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, feedback, rating, productName } = req.body;

    // Validation
    if (!feedback || !rating || !productName) {
      return res.status(400).json({ 
        message: 'Please provide feedback, rating, and product name' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const newFeedback = await Feedback.create({
      name: name || 'Anonymous',
      email,
      feedback,
      rating,
      productName
    });

    // Emit socket event for real-time updates
    req.io.emit('newFeedback', newFeedback);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      message: 'Error submitting feedback', 
      error: error.message 
    });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (public - limited data)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .select('productName rating createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      message: 'Error fetching feedback', 
      error: error.message 
    });
  }
});

// @route   GET /api/feedback/products
// @desc    Get unique product names
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const products = await Feedback.distinct('productName');
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
});

export default router;