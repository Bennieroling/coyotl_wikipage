// server/controllers/pageController.js
const Page = require('../models/Page');

// Get all pages with filtering, search, and pagination
exports.getPages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      sort = '-updatedAt'
    } = req.query;
    
    // Build query
    let query = {};
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Tag filter
    if (tag) {
      query.tags = tag;
    }
    
    // Published pages only for non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    }
    
    // Count total
    const total = await Page.countDocuments(query);
    
    // Get pages with pagination
    const pages = await Page.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
    
    // Pagination info
    const pagination = {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    };
    
    res.json({ pages, pagination });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get page by slug
exports.getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug })
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Check if page is published or user is admin
    if (!page.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create page
exports.createPage = async (req, res) => {
  try {
    const { title, content, tags, category, isPublished } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Create new page
    const page = new Page({
      title,
      content: content || '',
      tags: tags || [],
      category: category || '',
      isPublished: isPublished === undefined ? true : isPublished,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
    
    // Save page
    await page.save();
    
    res.status(201).json(page);
  } catch (error) {
    console.error('Create page error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this title already exists' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Update page
exports.updatePage = async (req, res) => {
  try {
    const { title, content, tags, category, isPublished } = req.body;
    
    // Find page
    let page = await Page.findOne({ slug: req.params.slug });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Update fields
    if (title !== undefined) page.title = title;
    if (content !== undefined) page.content = content;
    if (tags !== undefined) page.tags = tags;
    if (category !== undefined) page.category = category;
    if (isPublished !== undefined) page.isPublished = isPublished;
    
    // Set updated by
    page.updatedBy = req.user.id;
    
    // Save updated page
    await page.save();
    
    res.json(page);
  } catch (error) {
    console.error('Update page error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this title already exists' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete page
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    await page.remove();
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Page.distinct('category');
    
    // Filter out empty categories
    const filteredCategories = categories.filter(category => category && category.trim() !== '');
    
    res.json(filteredCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Page.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $match: { _id: { $ne: '' } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};