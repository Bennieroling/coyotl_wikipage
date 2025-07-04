const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const PAGES_DIR = path.join(__dirname, '../../pages');

// Get all HTML files
router.get('/', async (req, res) => {
  try {
    const files = await fs.readdir(PAGES_DIR);
    const htmlFiles = files
      .filter(file => file.endsWith('.html'))
      .map(file => ({
        filename: file,
        slug: file.replace('.html', ''),
        title: file.replace('.html', '').replace(/-/g, ' ')
      }));
    
    res.json({ files: htmlFiles });
  } catch (error) {
    res.status(500).json({ message: 'Error reading HTML files', error: error.message });
  }
});

// Get specific HTML file
router.get('/:slug', async (req, res) => {
  try {
    const filename = `${req.params.slug}.html`;
    const filePath = path.join(PAGES_DIR, filename);
    const content = await fs.readFile(filePath, 'utf8');
    
    res.json({
      slug: req.params.slug,
      filename: filename,
      content: content
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ message: 'HTML file not found' });
    } else {
      res.status(500).json({ message: 'Error reading HTML file', error: error.message });
    }
  }
});

// Create new HTML file
router.post('/', protect, async (req, res) => {
  try {
    const { slug, content } = req.body;
    
    if (!slug || !content) {
      return res.status(400).json({ message: 'Slug and content are required' });
    }
    
    const filename = `${slug}.html`;
    const filePath = path.join(PAGES_DIR, filename);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return res.status(409).json({ message: 'HTML file already exists' });
    } catch (error) {
      // File doesn't exist, which is good for creation
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    
    res.status(201).json({
      message: 'HTML file created successfully',
      slug: slug,
      filename: filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating HTML file', error: error.message });
  }
});

// Update HTML file
router.put('/:slug', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const filename = `${req.params.slug}.html`;
    const filePath = path.join(PAGES_DIR, filename);
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    
    res.json({
      message: 'HTML file updated successfully',
      slug: req.params.slug,
      filename: filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating HTML file', error: error.message });
  }
});

// Delete HTML file
router.delete('/:slug', protect, async (req, res) => {
  try {
    const filename = `${req.params.slug}.html`;
    const filePath = path.join(PAGES_DIR, filename);
    
    await fs.unlink(filePath);
    
    res.json({
      message: 'HTML file deleted successfully',
      slug: req.params.slug
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ message: 'HTML file not found' });
    } else {
      res.status(500).json({ message: 'Error deleting HTML file', error: error.message });
    }
  }
});

module.exports = router;
