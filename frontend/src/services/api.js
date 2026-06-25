import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token dynamically
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle response anomalies globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If unauthorized, clear token and redirect or alert user
    if (error.response && error.response.status === 401) {
      removeToken();
      // Optionally redirect to login, but we'll let ProtectedRoute/Page context trigger state changes
    }
    return Promise.reject(error);
  }
);

export default API;
