import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on mount
    checkExistingAuth();
  }, []);

  const checkExistingAuth = () => {
    try {
      const adminData = localStorage.getItem('adminData');
      console.log('🔍 Checking existing auth:', adminData ? 'Found' : 'Not found');
      
      if (adminData) {
        const parsed = JSON.parse(adminData);
        
        // Verify required fields exist
        if (parsed.token && parsed.email) {
          setAdmin(parsed);
          console.log('✅ Auth restored:', parsed.username || parsed.email);
        } else {
          console.warn('⚠️ Invalid admin data structure, clearing...');
          localStorage.removeItem('adminData');
        }
      }
    } catch (error) {
      console.error('❌ Error parsing admin data:', error);
      localStorage.removeItem('adminData');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Validate input
      if (!email || !password) {
        return { 
          success: false, 
          message: 'Email and password are required' 
        };
      }

      const response = await api.post('/api/admin/login', { 
        email: email.trim(), 
        password 
      });

      console.log('✅ Login response:', response.data);

      if (response.data && response.data.data) {
        const adminData = response.data.data;
        
        // Verify token exists
        if (!adminData.token) {
          console.error('❌ No token in response');
          return { 
            success: false, 
            message: 'Authentication failed - no token received' 
          };
        }

        // Save to state and localStorage
        setAdmin(adminData);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        console.log('✅ Admin logged in:', adminData.username || adminData.email);
        
        return { success: true };
      } else {
        console.error('❌ Invalid response structure:', response.data);
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Handle specific error cases
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          return { 
            success: false, 
            message: message || 'Invalid email or password' 
          };
        } else if (status === 404) {
          return { 
            success: false, 
            message: 'Login endpoint not found. Check backend URL.' 
          };
        } else if (status === 500) {
          return { 
            success: false, 
            message: 'Server error. Please try again later.' 
          };
        }
        
        return { 
          success: false, 
          message: message || 'Login failed. Please try again.' 
        };
      } else if (error.request) {
        // No response from server
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check if backend is running.' 
        };
      } else {
        // Other errors
        return { 
          success: false, 
          message: error.message || 'An unexpected error occurred' 
        };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      // Validate input
      if (!username || !email || !password) {
        return { 
          success: false, 
          message: 'All fields are required' 
        };
      }

      if (username.length < 3) {
        return { 
          success: false, 
          message: 'Username must be at least 3 characters' 
        };
      }

      if (password.length < 6) {
        return { 
          success: false, 
          message: 'Password must be at least 6 characters' 
        };
      }

      const response = await api.post('/api/admin/register', { 
        username: username.trim(), 
        email: email.trim(), 
        password 
      });

      console.log('✅ Registration response:', response.data);

      if (response.data && response.data.data) {
        const adminData = response.data.data;
        
        // Verify token exists
        if (!adminData.token) {
          console.error('❌ No token in response');
          return { 
            success: false, 
            message: 'Registration failed - no token received' 
          };
        }

        // Save to state and localStorage
        setAdmin(adminData);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        console.log('✅ Admin registered:', adminData.username || adminData.email);
        
        return { success: true };
      } else {
        console.error('❌ Invalid response structure:', response.data);
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 409 || status === 400) {
          return { 
            success: false, 
            message: message || 'Email or username already exists' 
          };
        } else if (status === 404) {
          return { 
            success: false, 
            message: 'Registration endpoint not found. Check backend URL.' 
          };
        } else if (status === 500) {
          return { 
            success: false, 
            message: 'Server error. Please try again later.' 
          };
        }
        
        return { 
          success: false, 
          message: message || 'Registration failed. Please try again.' 
        };
      } else if (error.request) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check if backend is running.' 
        };
      } else {
        return { 
          success: false, 
          message: error.message || 'An unexpected error occurred' 
        };
      }
    }
  };

  const logout = () => {
    console.log('👋 Logging out');
    setAdmin(null);
    localStorage.removeItem('adminData');
  };

  const value = {
    admin,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};