const express = require('express');
const router = express.Router();
const { searchPages } = require('../controllers/searchController');

router.get('/', searchPages);

module.exports = router;