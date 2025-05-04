const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Check that these functions exist in the controller
console.log('Register function:', !!registerUser);
console.log('Login function:', !!loginUser);
console.log('Get User Profile function:', !!getUserProfile);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', protect, getUserProfile);

module.exports = router;