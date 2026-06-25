const authService = require('../services/AuthService');

class AuthController {
  /**
   * Handle user registration request
   * @param {Object} req 
   * @param {Object} res 
   * @param {Function} next 
   */
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login request
   * @param {Object} req 
   * @param {Object} res 
   * @param {Function} next 
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const authData = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: authData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
