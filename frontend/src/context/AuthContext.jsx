import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api'; // Changed from axios

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
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        setAdmin(parsed);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/admin/login', { email, password });
      setAdmin(data.data);
      localStorage.setItem('adminData', JSON.stringify(data.data));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/api/admin/register', { 
        username, 
        email, 
        password 
      });
      setAdmin(data.data);
      localStorage.setItem('adminData', JSON.stringify(data.data));
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
  };

  const value = {
    admin,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};