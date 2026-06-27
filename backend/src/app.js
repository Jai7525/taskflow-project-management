const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');

const app = express();

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API Documentation',
      version: '1.0.0',
      description: 'API documentation for the TaskFlow project management portal'
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://taskflow-project-management.onrender.com"
            : "http://localhost:5000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@taskflow.com' },
            password: { type: 'string', example: 'Password123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'Secret@123' }
          }
        },
        TaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Design homepage' },
            description: { type: 'string', example: 'Create the initial mockup' },
            status: {
              type: 'string',
              enum: ['Pending', 'In Progress', 'Completed'],
              example: 'Pending'
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'High'
            },
            dueDate: { type: 'string', format: 'date', example: '2025-12-31' }
          }
        },
        TaskResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Design homepage' },
            description: { type: 'string', example: 'Create the initial mockup' },
            status: { type: 'string', example: 'Pending' },
            priority: { type: 'string', example: 'High' },
            dueDate: { type: 'string', format: 'date', example: '2025-12-31' },
            userId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ActivityLogResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            action: { type: 'string', example: 'Task Created' },
            taskId: { type: 'integer', example: 5, nullable: true },
            task: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'integer', example: 5 },
                title: { type: 'string', example: 'Design homepage' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
            errors: { type: 'object', nullable: true }
          }
        }
      }
    }
  },
  // Explicit paths are more reliable than globs on Windows (backslash issue)
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/taskRoutes.js',
    './src/routes/workspaceRoutes.js'
  ]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Security Middlewares
app.use(helmet());
// CORS is intentionally open during development. Restrict to known origins before going to production.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use verbose 'combined' format in production for log aggregation tools; 'dev' in development for readability.
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route Redirect to API Docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspace', workspaceRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errors: null
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Surface 500s in server logs only — these are unexpected and need immediate attention.
  if (statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  // Surface full error details for production debugging
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || null
  });
});

module.exports = app;
