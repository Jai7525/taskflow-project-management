const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  async register(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email address is already in use');
      error.statusCode = 400;
      throw error;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user record
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Return user details without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  /**
   * Authenticate a user and generate JWT token
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Compare credentials
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT
    const payload = {
      userId: user.id,
      email: user.email
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'development_secret_key_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }
}

module.exports = new AuthService();
