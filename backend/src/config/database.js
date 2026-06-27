require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = process.env.DB_NAME;
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT, 10) || 26798;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  // SQL query logging is useful during development but adds noise in production.
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
      : {},
  pool: {
    // Keep the pool small since this is a single-user workspace app.
    // Increase max if concurrent request load grows.
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

const mysql = require('mysql2/promise');

const connectDatabase = async () => {
  try {
    // Sequelize cannot create the database itself, so we establish a root-level connection first.
    // This removes the manual setup step when deploying to a fresh environment.
    // Skip database creation completely in production since the managed database already exists.
    if (process.env.NODE_ENV !== 'production') {
      const connection = await mysql.createConnection({
        host: host,
        port: port,
        user: username,
        password: password
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
      await connection.end();
    }

    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

module.exports = {
  sequelize,
  connectDatabase
};
