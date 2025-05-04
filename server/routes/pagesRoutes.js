// server/routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', pageController.getPages);
router.get('/categories', pageController.getCategories);
router.get('/tags', pageController.getTags);
router.get('/:slug', pageController.getPage);

// Protected routes - require authentication
router.use(authMiddleware.protect);

// Create page - any authenticated user
router.post('/', pageController.createPage);

// Update and delete - only by editor/admin
router.put('/:slug', authMiddleware.editor, pageController.updatePage);
router.delete('/:slug', authMiddleware.editor, pageController.deletePage);

module.exports = router;