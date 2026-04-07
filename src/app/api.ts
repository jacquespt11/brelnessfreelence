import axios from 'axios';

// Get the base URL relying on environment variables or defaulting to localhost backend
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token seamlessly into all requests
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('brelness_user');
    if (userStr) {
      try {
        const userWithToken = JSON.parse(userStr);
        if (userWithToken.token) {
          config.headers.Authorization = `Bearer ${userWithToken.token}`;
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée ou non autorisée. Déconnexion automatique...");
      localStorage.removeItem('brelness_user');
      // Redirection logic can be handled here or inside AppContext, but clearing storage halts the loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
