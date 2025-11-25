import { BarChart3, Star, TrendingUp, Package } from 'lucide-react';

const FeedbackStats = ({ stats }) => {
  // Safety check - ensure stats exists and has required properties
  const safeStats = {
    totalFeedbacks: stats?.totalFeedbacks || 0,
    averageRating: stats?.averageRating || 0,
    productBreakdown: Array.isArray(stats?.productBreakdown) ? stats.productBreakdown : []
  };

  console.log('📊 FeedbackStats received:', safeStats);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Feedbacks */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Feedbacks</p>
              <h3 className="text-4xl font-bold mt-2">{safeStats.totalFeedbacks}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <BarChart3 size={32} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <TrendingUp size={16} />
            <span>All time</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Average Rating</p>
              <h3 className="text-4xl font-bold mt-2">
                {safeStats.averageRating > 0 ? safeStats.averageRating.toFixed(1) : '0.0'}
              </h3>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-lg">
              <Star size={32} fill="white" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={star <= Math.round(safeStats.averageRating) ? 'white' : 'none'}
                className={star <= Math.round(safeStats.averageRating) ? 'text-white' : 'text-yellow-100'}
              />
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Products</p>
              <h3 className="text-4xl font-bold mt-2">{safeStats.productBreakdown.length}</h3>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <Package size={32} />
            </div>
          </div>
          <p className="text-green-100 text-sm">Tracked products</p>
        </div>
      </div>

      {/* Product Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package size={24} />
          Product Breakdown
        </h3>

        {safeStats.productBreakdown.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No product data available</p>
            <p className="text-gray-400 text-sm mt-2">Feedback will appear here once submitted</p>
          </div>
        ) : (
          <div className="space-y-4">
            {safeStats.productBreakdown.map((product, index) => {
              // Safety check for product properties
              const productName = product?.productName || product?._id || `Product ${index + 1}`;
              const count = product?.count || 0;
              const avgRating = product?.averageRating || 0;
              const percentage = safeStats.totalFeedbacks > 0 
                ? ((count / safeStats.totalFeedbacks) * 100).toFixed(1) 
                : 0;

              return (
                <div key={product?._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{productName}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={16} fill="#FCD34D" className="text-yellow-400" />
                          <span className="text-sm text-gray-600 font-medium">
                            {avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">
                          {count} {count === 1 ? 'feedback' : 'feedbacks'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                      <div className="text-xs text-gray-500">of total</div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Star size={24} className="text-yellow-500" />
          Rating Distribution
        </h3>

        {safeStats.totalFeedbacks === 0 ? (
          <div className="text-center py-12">
            <Star size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No ratings yet</p>
            <p className="text-gray-400 text-sm mt-2">Rating distribution will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = safeStats.productBreakdown.reduce((acc, product) => {
                // This is a simplified calculation - adjust based on your actual data structure
                return acc;
              }, 0);
              const percentage = 20; // Placeholder - calculate based on actual data

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-24">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star size={16} fill="#FCD34D" className="text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackStats;