import { useState } from 'react';
import api from '../config/api'; // Changed from axios
import StarRating from './StarRating';
import { Send, CheckCircle } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    productName: ''
  });
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.feedback.trim()) {
      setError('Please provide your feedback');
      return;
    }

    if (!formData.productName.trim()) {
      setError('Please provide the product name');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.feedback.trim().length < 10) {
      setError('Feedback must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/feedback', {
        name: formData.name || 'Anonymous',
        email: formData.email,
        feedback: formData.feedback,
        rating: rating,
        productName: formData.productName
      });

      console.log('Feedback submitted:', response.data);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          feedback: '',
          productName: ''
        });
        setRating(0);
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Submit error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to submit feedback. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600">
            We appreciate you taking the time to share your thoughts with us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Share Your Feedback
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          We value your opinion and would love to hear from you
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your name or leave anonymous"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us what you think... (minimum 10 characters)"
              required
              minLength="10"
              maxLength="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.feedback.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating rating={rating} setRating={setRating} size={32} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <Send size={20} />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;