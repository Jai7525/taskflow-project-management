const supertest = require('supertest');
const app = require('../src/app');
const { registerTestUser, loginTestUser } = require('./helpers');
const { User } = require('../src/models');

const request = supertest(app);

describe('Authentication API Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should successfully register a new user with valid details', async () => {
      // Act
      const response = await registerTestUser(request, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data).not.toHaveProperty('password');

      // Database verification
      const dbUser = await User.findOne({ where: { email: 'john@example.com' } });
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toBe('John Doe');
    });

    it('should reject registration attempts with a duplicate email', async () => {
      // Arrange
      await registerTestUser(request, {
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      });

      // Act
      const response = await registerTestUser(request, {
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message.toLowerCase()).toContain('already');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      // Arrange
      await registerTestUser(request, {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'Password123!',
      });

      // Act
      const response = await loginTestUser(request, {
        email: 'alice@example.com',
        password: 'Password123!',
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.user.email).toBe('alice@example.com');
    });
  });

  describe('GET protected endpoint security', () => {
    it('should reject access to a protected route without a JWT token', async () => {
      // Act
      const response = await request.get('/api/tasks');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
