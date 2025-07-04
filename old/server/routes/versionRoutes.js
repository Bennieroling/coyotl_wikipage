const express = require('express');
const router = express.Router();
const {
  createVersion,
  getVersionsByPageId,
  getVersionById,
  restoreVersion,
} = require('../controllers/versionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createVersion);
router.get('/page/:pageId', getVersionsByPageId);
router.get('/:id', getVersionById);
router.post('/:id/restore', protect, restoreVersion);

module.exports = router;