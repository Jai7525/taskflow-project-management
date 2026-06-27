process.env.NODE_ENV = 'test';
process.env.PORT = 5001;

const { Sequelize } = require('sequelize');

// Create an isolated in-memory SQLite database instance for tests
const mockSequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Mock the database configuration module to export our SQLite instance
// Jest permits variables prefixed with "mock" to be referenced in the hoisted factory scope
jest.mock('../src/config/database', () => ({
  sequelize: mockSequelize,
  connectDatabase: jest.fn().mockResolvedValue(true),
}));

const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Sync schemas in the memory database
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  // Clean all tables to guarantee perfect test isolation
  await sequelize.query('PRAGMA foreign_keys = OFF');
  await sequelize.models.ActivityLog.destroy({ where: {}, truncate: true });
  await sequelize.models.Task.destroy({ where: {}, truncate: true });
  await sequelize.models.User.destroy({ where: {}, truncate: true });
  await sequelize.query('PRAGMA foreign_keys = ON');
});

afterAll(async () => {
  // Close database to release resources
  await sequelize.close();
});
