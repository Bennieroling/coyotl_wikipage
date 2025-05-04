const User = require('./User');
const Page = require('./Page');
const File = require('./File');

// Define relationships
User.hasMany(Page, { foreignKey: 'createdBy' });
Page.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Page, { foreignKey: 'updatedBy' });
Page.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

User.hasMany(File, { foreignKey: 'uploadedBy' });
File.belongsTo(User, { foreignKey: 'uploadedBy' });

module.exports = {
  User,
  Page,
  File,
};