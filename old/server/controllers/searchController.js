const { Page, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Search pages
const searchPages = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Perform PostgreSQL full-text search query
    const pages = await sequelize.query(`
      SELECT p.id, p.title, p.slug, p.content, p.category, p."createdAt", p."updatedAt", 
             u.username as "creatorName"
      FROM "Pages" p
      LEFT JOIN "Users" u ON p."createdBy" = u.id
      WHERE to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', :query)
      ORDER BY ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', :query)) DESC
      LIMIT 20
    `, {
      replacements: { query: q },
      type: sequelize.QueryTypes.SELECT
    });

    // Extract preview snippets
    const results = pages.map(page => {
      // Extract a snippet around the matched text
      let snippet = '';
      const maxSnippetLength = 200;
      
      // Get a content snippet that contains the search term if possible
      if (page.content) {
        const plainContent = page.content.replace(/<[^>]+>/g, ' '); // Remove HTML tags
        const lowerContent = plainContent.toLowerCase();
        const lowerQuery = q.toLowerCase();
        
        const index = lowerContent.indexOf(lowerQuery);
        if (index !== -1) {
          const start = Math.max(0, index - 50);
          const end = Math.min(plainContent.length, index + q.length + 150);
          snippet = plainContent.substring(start, end).trim();
          
          if (start > 0) {
            snippet = '...' + snippet;
          }
          if (end < plainContent.length) {
            snippet = snippet + '...';
          }
        } else {
          // If the exact term isn't found, just use the first part of the content
          snippet = plainContent.substring(0, maxSnippetLength) + '...';
        }
      }
      
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        snippet,
        category: page.category,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        creatorName: page.creatorName
      };
    });
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
};

module.exports = { searchPages };