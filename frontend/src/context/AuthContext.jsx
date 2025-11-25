import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
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
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(adminData).token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
    const { data } = await api.post('/api/admin/login', { email, password });
      setAdmin(data.data);
      localStorage.setItem('adminData', JSON.stringify(data.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/admin/register', { 
        username, 
        email, 
        password 
      });
      setAdmin(data.data);
      localStorage.setItem('adminData', JSON.stringify(data.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    delete axios.defaults.headers.common['Authorization'];
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