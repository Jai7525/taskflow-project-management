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
    // On 401, the token is invalid or expired — clear it and redirect to login.
    // IMPORTANT: Skip this handler for auth endpoints (/login, /register).
    // Login failures (wrong password) return 401 and must be handled locally
    // on the LoginPage itself — not by triggering a global logout + redirect.
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register');

    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      removeToken();
      localStorage.removeItem('taskflow_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
