import axios from 'axios';

// API URL from environment variables with fallback
const getApiBaseUrl = () => {
  // Force production backend URL temporarily to fix CORS
  // TODO: Configure VITE_API_BASE_URL in Vercel dashboard for proper solution
  return 'https://church-management-backend-7owp.onrender.com/api';
  
  // Use environment variable if available (commented for now)
  // const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  // if (envApiUrl) {
  //   return envApiUrl;
  // }
  
  // Fallback logic for environments without .env files
  // const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  // if (isProduction) {
  //   console.error('No production backend configured. Please set VITE_API_BASE_URL environment variable.');
  //   return 'http://localhost:5000/api';
  // }
  
  // return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
