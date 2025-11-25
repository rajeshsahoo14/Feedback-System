import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'Anonymous'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    trim: true,
    minlength: [10, 'Feedback must be at least 10 characters'],
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackSchema.index({ productName: 1, rating: -1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;