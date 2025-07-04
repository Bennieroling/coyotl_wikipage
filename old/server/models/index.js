const User = require('./User');
const Page = require('./Page');
const File = require('./File');
const Version = require('./Version');


// Define relationships
User.hasMany(Page, { foreignKey: 'createdBy' });
Page.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Page, { foreignKey: 'updatedBy' });
Page.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

User.hasMany(File, { foreignKey: 'uploadedBy' });
File.belongsTo(User, { foreignKey: 'uploadedBy' });

Page.hasMany(Version, { foreignKey: 'pageId' });
Version.belongsTo(Page, { foreignKey: 'pageId' });

User.hasMany(Version, { foreignKey: 'createdBy' });
Version.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  User,
  Page,
  File,
  Version,
};