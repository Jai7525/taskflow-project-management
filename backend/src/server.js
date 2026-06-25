require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/database');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Try connecting to the database and ensure the database exists
  await connectDatabase();

  // Sync Sequelize models to database tables
  try {
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');
  } catch (error) {
    console.error('Database synchronization failed:', error.message);
  }

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection! Shutting down...', err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
