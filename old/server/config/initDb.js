const { sequelize } = require('./db');
const { User, Page, File } = require('../models');

const initializeDatabase = async () => {
  try {
    // Sync all models with the database
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

    // Create an initial welcome page
    await Page.create({
      title: 'Welcome to Custom Wiki',
      content: '<h1>Welcome to Custom Wiki</h1><p>This is your first wiki page. You can edit this page or create new ones.</p>',
      createdBy: 1, // admin user id
    });
    console.log('Initial page created');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { initializeDatabase };