require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = (process.env.DB_NAME || '').trim();
const username = (process.env.DB_USER || 'root').trim();
const password = (process.env.DB_PASSWORD || '').trim();
const rawHost = process.env.DB_HOST || 'localhost';
const host = rawHost.trim();
const port = parseInt(process.env.DB_PORT, 10) || 26798;

// DB Host Resolution Diagnostics for Render logs
const dns = require('dns');
console.log('--- DATABASE HOST RESOLUTION DIAGNOSTICS ---');
console.log(`Raw DB_HOST from env: "${rawHost}"`);
console.log(`Raw Length: ${rawHost.length}`);
console.log(`Raw Char Codes: ${Array.from(rawHost).map(c => c.charCodeAt(0)).join(', ')}`);
console.log(`Trimmed DB_HOST: "${host}"`);
dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error(`DNS lookup failed for "${host}":`, err.message);
  } else {
    console.log(`DNS lookup succeeded for "${host}": ${address} (IPv${family})`);
  }
});
console.log('---------------------------------------------');

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
