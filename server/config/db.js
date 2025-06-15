// server/config/db.js
require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[HIDDEN]' : 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// Use environment variables or defaults
const DB_NAME = process.env.DB_NAME || 'custom_wiki';
const DB_USER = process.env.DB_USER || 'wiki_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'wiki_password_123';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT) || 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, // Set to console.log for debugging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL Connection established successfully to ${DB_NAME}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Database config used:', { DB_NAME, DB_USER, DB_HOST, DB_PORT, hasPassword: !!DB_PASSWORD });
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };