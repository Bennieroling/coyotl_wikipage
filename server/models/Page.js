const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const Page = sequelize.define(
  'Page',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'Uncategorized',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hook to create slug from title before save
Page.beforeCreate(async (page) => {
  page.slug = slugify(page.title, { lower: true });
});

Page.beforeUpdate(async (page) => {
  if (page.changed('title')) {
    page.slug = slugify(page.title, { lower: true });
  }
});

module.exports = Page;