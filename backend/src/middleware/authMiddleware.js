const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * JWT Authentication Middleware
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing or invalid',
        errors: null
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Inner try/catch isolates JWT verification failures (expired, tampered) from
    // unexpected database errors so each can return the correct HTTP status.
    let decoded;
    try {
      // The fallback secret is for local development only. In production, JWT_SECRET must be set.
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret_key_12345');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token',
        errors: null
      });
    }

    // Check if user still exists in database
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authenticated user no longer exists',
        errors: null
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticateJWT;
