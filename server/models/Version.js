const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Version = sequelize.define(
  'Version',
  {
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Version;

// Add to model associations in models/index.js:
// Page.hasMany(Version, { foreignKey: 'pageId' });
// Version.belongsTo(Page, { foreignKey: 'pageId' });
// User.hasMany(Version, { foreignKey: 'createdBy' });
// Version.belongsTo(User, { foreignKey: 'createdBy' });