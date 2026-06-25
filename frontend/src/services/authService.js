import API from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Service to handle authentication API interactions
 */
const authService = {
  /**
   * Registers a new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>}
   */
  register: async (userData) => {
    const response = await API.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Logins a user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    const response = await API.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Fetches the current user profile (optional / me route)
   * @returns {Promise<Object>}
   */
  getMe: async () => {
    const response = await API.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }
};

export default authService;
