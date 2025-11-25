import axios from 'axios';

// Get API URL from environment or use localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔧 API URL being used:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Changed to true for cookie-based auth if needed
  timeout: 15000 // Increased to 15 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    try {
      // Get admin data from localStorage
      const adminData = localStorage.getItem('adminData');
      
      if (adminData) {
        const parsed = JSON.parse(adminData);
        
        // Add token to Authorization header
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
          console.log('✅ Token attached to request');
        } else {
          console.warn('⚠️ No token found in adminData');
        }
      } else {
        console.warn('⚠️ No adminData in localStorage');
      }
    } catch (error) {
      console.error('❌ Error parsing admin data:', error);
      // Clear corrupted data
      localStorage.removeItem('adminData');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error [${status}]:`, data);
      
      // Handle specific status codes
      switch (status) {
        case 401:
          console.error('🔒 Unauthorized - Token may be invalid or expired');
          // Clear invalid auth data
          localStorage.removeItem('adminData');
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
          break;
          
        case 403:
          console.error('🚫 Forbidden - Access denied');
          break;
          
        case 404:
          console.error('🔍 Not Found - Endpoint does not exist');
          break;
          
        case 500:
          console.error('💥 Server Error - Backend issue');
          break;
          
        default:
          console.error('⚠️ Unexpected error status:', status);
      }
      
    } else if (error.request) {
      // Request made but no response received
      console.error('📡 No response from server:', error.request);
      console.error('Check if backend is running at:', API_URL);
      
    } else {
      // Something else happened
      console.error('⚠️ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend is healthy:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
};

export default api;
export { API_URL };