require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/database');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Node version:", process.version);
  // Try connecting to the database and ensure the database exists
  await connectDatabase();

  // Sync Sequelize models to database tables
  try {
    // alter:true updates columns to match the model without dropping data.
    // Use force:true only in dev when schema changes cannot be migrated cleanly.
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');

    // Seed or restore the public demo account so it remains always usable with default credentials
    const { User } = require('./models');
    const demoEmail = 'admin@taskflow.com';
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    const existingDemoUser = await User.findOne({ where: { email: demoEmail } });
    if (!existingDemoUser) {
      await User.create({
        name: 'Demo Admin',
        email: demoEmail,
        password: hashedPassword
      });
      console.log('Demo user seeded successfully.');
    } else {
      // Force reset the password on startup to prevent lockouts if users modify the demo password in production
      existingDemoUser.name = 'Demo Admin';
      existingDemoUser.password = hashedPassword;
      await existingDemoUser.save();
      console.log('Demo user credentials verified and restored.');
    }
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
