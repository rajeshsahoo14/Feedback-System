import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_URL } from '../config/api';
import io from 'socket.io-client';
import StarRating from './StarRating';
import FeedbackStats from './FeedbackStats';
import { LogOut, Trash2, Filter, RefreshCw, BarChart3, List } from 'lucide-react';

// Socket connection
const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();

  // State declarations
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    productBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('stats');
  const [filters, setFilters] = useState({
    productName: '',
    sortBy: 'date',
    minRating: ''
  });

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('newFeedback', (newFeedback) => {
      console.log('New feedback received:', newFeedback);
      setFeedbacks(prev => [newFeedback, ...prev]);
      fetchStats();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('newFeedback');
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.productName) params.append('productName', filters.productName);
      if (filters.sortBy === 'rating') params.append('sortBy', 'rating');
      if (filters.minRating) params.append('minRating', filters.minRating);

      const response = await api.get(`/api/admin/feedback?${params.toString()}`);
      console.log('📦 Feedbacks response:', response.data);

      // Handle different response structures
      let feedbackData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          feedbackData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          feedbackData = response.data.data;
        } else if (response.data.feedbacks && Array.isArray(response.data.feedbacks)) {
          feedbackData = response.data.feedbacks;
        }
      }

      console.log('✅ Processed feedbacks:', feedbackData.length);
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('❌ Error fetching feedbacks:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
      // Set empty array on error to prevent undefined
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      console.log('📊 Stats response:', response.data);

      // Handle different response structures
      let statsData = {
        totalFeedbacks: 0,
        averageRating: 0,
        productBreakdown: []
      };

      if (response.data) {
        if (response.data.data) {
          statsData = {
            totalFeedbacks: response.data.data.totalFeedbacks || 0,
            averageRating: response.data.data.averageRating || 0,
            productBreakdown: Array.isArray(response.data.data.productBreakdown) 
              ? response.data.data.productBreakdown 
              : []
          };
        } else {
          statsData = {
            totalFeedbacks: response.data.totalFeedbacks || 0,
            averageRating: response.data.averageRating || 0,
            productBreakdown: Array.isArray(response.data.productBreakdown) 
              ? response.data.productBreakdown 
              : []
          };
        }
      }

      console.log('✅ Processed stats:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      // Keep default stats structure on error
      setStats({
        totalFeedbacks: 0,
        averageRating: 0,
        productBreakdown: []
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/feedback/${id}`);
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      productName: '',
      sortBy: 'date',
      minRating: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {admin?.username || 'Admin'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setView('stats')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              view === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={20} />
            Statistics
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <List size={20} />
            Feedback List
          </button>
        </div>

        {/* Statistics View */}
        {view === 'stats' && <FeedbackStats stats={stats} />}

        {/* Feedback List View */}
        {view === 'list' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={filters.productName}
                    onChange={handleFilterChange}
                    placeholder="Filter by product"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="rating">Rating (Highest First)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {!Array.isArray(feedbacks) || feedbacks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-500 text-lg">No feedback found</p>
                </div>
              ) : (
                feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {feedback.name || 'Anonymous'}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {feedback.productName}
                          </span>
                        </div>
                        {feedback.email && (
                          <p className="text-sm text-gray-600 mb-2">{feedback.email}</p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={feedback.rating} readOnly size={20} />
                          <span className="text-sm text-gray-600">
                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Delete feedback"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;