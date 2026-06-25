require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Try connecting to the database
  await connectDatabase();

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
