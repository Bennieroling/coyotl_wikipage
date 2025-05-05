const express = require('express');
const router = express.Router();

// Add more explicit debugging
console.log('Loading auth routes...');

// Import controller functions 
const authController = require('../controllers/authController');
console.log('Auth controller loaded:', Object.keys(authController));

const { registerUser, loginUser, getUserProfile } = authController;
console.log('Register function:', !!registerUser);
console.log('Login function:', !!loginUser);
console.log('Get User Profile function:', !!getUserProfile);

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// Add a simple test route that doesn't require the database
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

// Define routes with explicit debugging
router.post('/register', (req, res) => {
  console.log('Register route accessed with body:', req.body);
  registerUser(req, res);
});

router.post('/login', (req, res) => {
  console.log('Login route accessed with body:', req.body);
  loginUser(req, res);
});

router.get('/user', protect, (req, res) => {
  console.log('Get user profile route accessed');
  getUserProfile(req, res);
});

console.log('Auth routes registered successfully');
module.exports = router;