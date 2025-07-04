const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Temporary placeholder controller functions until we implement them properly
const pageController = {
  getPages: (req, res) => res.json({ message: 'Get all pages - to be implemented' }),
  getPageBySlug: (req, res) => res.json({ message: 'Get page by slug - to be implemented' }),
  createPage: (req, res) => res.json({ message: 'Create page - to be implemented' }),
  updatePage: (req, res) => res.json({ message: 'Update page - to be implemented' }),
  deletePage: (req, res) => res.json({ message: 'Delete page - to be implemented' })
};

// Routes
router.route('/')
  .get(pageController.getPages)
  .post(protect, pageController.createPage);

router.route('/:slug')
  .get(pageController.getPageBySlug)
  .put(protect, pageController.updatePage)
  .delete(protect, pageController.deletePage);

module.exports = router;