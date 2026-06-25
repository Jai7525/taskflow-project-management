const { body, param, validationResult } = require('express-validator');

// Reusable validator result checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be one of: Pending, In Progress, Completed'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be one of: Low, Medium, High'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO8601 date'),

  validate
];

const updateTaskValidator = [
  param('id')
    .isUUID(4).withMessage('Invalid task ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be one of: Pending, In Progress, Completed'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be one of: Low, Medium, High'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO8601 date'),

  validate
];

const validateParams = [
  param('id')
    .isUUID(4).withMessage('Invalid task ID format'),
  validate
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  validateParams
};
