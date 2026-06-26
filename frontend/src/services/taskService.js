import API from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Service to handle task-related API requests
 */
const taskService = {
  /**
   * Fetches tasks with query parameters for search, filtering, pagination, and sorting
   * @param {Object} params - { page, limit, status, search, sort }
   * @returns {Promise<Object>}
   */
  getTasks: async (params = {}) => {
    const response = await API.get(API_ENDPOINTS.TASKS.BASE, { params });
    return response.data;
  },

  /**
   * Retrieves a single task's details
   * @param {string} id - Task UUID
   * @returns {Promise<Object>}
   */
  getTaskById: async (id) => {
    const response = await API.get(API_ENDPOINTS.TASKS.DETAIL(id));
    return response.data;
  },

  /**
   * Creates a new task
   * @param {Object} data - { title, description, status, priority, dueDate }
   * @returns {Promise<Object>}
   */
  createTask: async (data) => {
    const response = await API.post(API_ENDPOINTS.TASKS.BASE, data);
    return response.data;
  },

  /**
   * Updates an existing task
   * @param {string} id - Task UUID
   * @param {Object} data - { title, description, status, priority, dueDate }
   * @returns {Promise<Object>}
   */
  updateTask: async (id, data) => {
    const response = await API.put(API_ENDPOINTS.TASKS.DETAIL(id), data);
    return response.data;
  },

  /**
   * Retrieves workspace statistics
   * @returns {Promise<Object>}
   */
  getStatistics: async () => {
    const response = await API.get(API_ENDPOINTS.WORKSPACE.STATISTICS);
    return response.data;
  },

  /**
   * Retrieves recent activity logs
   * @returns {Promise<Object>}
   */
  getRecentActivity: async () => {
    const response = await API.get(API_ENDPOINTS.WORKSPACE.ACTIVITY);
    return response.data;
  },

  /**
   * Marks a task as completed
   * @param {string} id - Task UUID
   * @returns {Promise<Object>}
   */
  completeTask: async (id) => {
    const response = await API.patch(API_ENDPOINTS.TASKS.COMPLETE(id));
    return response.data;
  },

  /**
   * Deletes a task
   * @param {string} id - Task UUID
   * @returns {Promise<Object>}
   */
  deleteTask: async (id) => {
    const response = await API.delete(API_ENDPOINTS.TASKS.DETAIL(id));
    return response.data;
  }
};

export default taskService;
