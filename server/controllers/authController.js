// server/controllers/authController.js
const User = require('./models/User'); // Corrected path
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

// Register user - note the exports. prefix
exports.register = async (req, res) => {
  try {
    // Log the request body to see what's being received
    console.log('Registration attempt:', req.body);
    
    const { username, email, password } = req.body;
    
    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Should be hashed in the User model pre-save middleware
    });
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Return success with token and user info
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  // Your existing login code...
};

// Get current user
exports.getUser = async (req, res) => {
  // Your existing getUser code...
};

// Export all functions
module.exports = {
  register: exports.register,
  login: exports.login,
  getUser: exports.getUser
};