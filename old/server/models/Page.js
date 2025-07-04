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

const setupFullTextSearch = async () => {
  try {
    // Create a full-text search index on title and content
    await sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
      
      CREATE INDEX IF NOT EXISTS pages_title_content_idx 
      ON "Pages" USING GIN (
        to_tsvector('english', "title" || ' ' || "content")
      );
    `);
    console.log('Full-text search index created for Pages');
  } catch (error) {
    console.error('Failed to create full-text search index:', error);
  }
};

module.exports = Page;