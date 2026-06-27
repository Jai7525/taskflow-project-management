/**
 * Testing Reusable Helpers
 * Prevents authentication duplication and streamlines test arrange steps.
 */

/**
 * Registers a test user
 * @param {Object} request - Supertest request object
 * @param {Object} userDetails - Optional overrides for registration data
 * @returns {Promise<Object>} Response object
 */
const registerTestUser = async (request, userDetails = {}) => {
  const defaults = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };
  return request
    .post('/api/auth/register')
    .send({ ...defaults, ...userDetails });
};

/**
 * Logins a test user
 * @param {Object} request - Supertest request object
 * @param {Object} credentials - Optional overrides for credentials
 * @returns {Promise<Object>} Response object containing JWT
 */
const loginTestUser = async (request, credentials = {}) => {
  const defaults = {
    email: 'test@example.com',
    password: 'Password123!',
  };
  return request
    .post('/api/auth/login')
    .send({ ...defaults, ...credentials });
};

/**
 * Registers and logins a test user, returning the JWT token
 * @param {Object} request - Supertest request object
 * @param {Object} userDetails - Optional overrides for registration/login data
 * @returns {Promise<string>} JWT auth token
 */
const getAuthToken = async (request, userDetails = {}) => {
  const email = userDetails.email || 'test@example.com';
  const password = userDetails.password || 'Password123!';
  await registerTestUser(request, { email, password, ...userDetails });
  const loginRes = await loginTestUser(request, { email, password });
  return loginRes.body.data.token;
};

/**
 * Creates a test task for an authenticated user
 * @param {Object} request - Supertest request object
 * @param {string} token - JWT Authorization token
 * @param {Object} taskDetails - Optional overrides for task data
 * @returns {Promise<Object>} Response object containing created task
 */
const createTestTask = async (request, token, taskDetails = {}) => {
  const defaults = {
    title: 'Test Task',
    description: 'This is a test task.',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2025-12-31T00:00:00.000Z',
  };
  return request
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...defaults, ...taskDetails });
};

module.exports = {
  registerTestUser,
  loginTestUser,
  getAuthToken,
  createTestTask,
};
