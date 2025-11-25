import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const adminData = localStorage.getItem('adminData');
  if (adminData) {
    const { token } = JSON.parse(adminData);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_URL };