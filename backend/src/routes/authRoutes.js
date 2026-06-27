/**
 * Authentication Routes
 *
 * Exposes API endpoints for user registration and authentication (login).
 * Connects request body validators and delegates calls to the AuthController.
 */

const express = require('express');
const authController = require('../controllers/AuthController');
const { registerValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

// POST /api/auth/register - Register a new user account (Validates name, email, password length)
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login - Authenticate user credentials and return JWT
router.post('/login', loginValidator, authController.login);

module.exports = router;
