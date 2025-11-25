import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Feedback from '../models/Feedback.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/admin/register
// @desc    Register new admin (for initial setup only)
// @access  Public (should be protected in production)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (adminExists) {
      return res.status(400).json({ 
        message: 'Admin already exists' 
      });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password
    });

    if (admin) {
      res.status(201).json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          token: generateToken(admin._id)
        }
      });
    }
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ 
      message: 'Error registering admin', 
      error: error.message 
    });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          token: generateToken(admin._id)
        }
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
});

// @route   GET /api/admin/feedback
// @desc    Get all feedback with filters
// @access  Private
router.get('/feedback', protect, async (req, res) => {
  try {
    const { productName, sortBy, minRating } = req.query;
    
    // Build query
    let query = {};
    if (productName) {
      query.productName = productName;
    }
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }

    // Build sort
    let sort = { createdAt: -1 };
    if (sortBy === 'rating') {
      sort = { rating: -1, createdAt: -1 };
    }

    const feedbacks = await Feedback.find(query).sort(sort);

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

// @route   GET /api/admin/stats
// @desc    Get feedback statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // Total feedbacks
    const totalFeedbacks = await Feedback.countDocuments();

    // Average rating
    const avgRatingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    const avgRating = avgRatingResult[0]?.avgRating || 0;

    // Product-wise stats
    const productStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$productName',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Rating distribution
    const ratingDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Recent feedbacks
    const recentFeedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName rating createdAt');

    res.json({
      success: true,
      data: {
        totalFeedbacks,
        avgRating: avgRating.toFixed(2),
        productStats,
        ratingDistribution,
        recentFeedbacks
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Private
router.delete('/feedback/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ 
      message: 'Error deleting feedback', 
      error: error.message 
    });
  }
});

export default router;