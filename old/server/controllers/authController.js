console.log('Loading auth controller...');

const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  console.log('RegisterUser function called with body:', req.body);
  
  const { username, email, password } = req.body;

  try {
    console.log('Checking if user exists...');
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user...');
    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      console.log('User created successfully');
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  console.log('LoginUser function called with body:', req.body);
  
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  console.log('GetUserProfile function called for user:', req.user?.id);
  
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

const controller = { registerUser, loginUser, getUserProfile };
console.log('Auth controller loaded with methods:', Object.keys(controller));
module.exports = controller;