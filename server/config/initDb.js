    // server/config/initDb.js
const { sequelize } = require('./db');
const { User, Page, File } = require('../models');

const initializeDatabase = async () => {
  try {
    // Sync all models with the database
    // force: true will drop tables if they exist
    // Use with caution in production!
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create an admin user
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
    });
    console.log('Admin user created');

    // Create some initial pages
    await Page.create({
      title: 'Welcome to Custom Wiki',
      content: '<h1>Welcome to Your Custom Wiki</h1><p>This is the homepage of your wiki. You can edit this page or create new pages.</p>',
      createdBy: 1, // admin user id
    });
    console.log('Initial pages created');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { initializeDatabase };