const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { initializeDatabase } = require('./config/initDb');

// Import routes
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Connect to database
connectDB();

// Initialize database with initial data (comment out in production after first run)
// initializeDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log('Server starting up...');
console.log('Checking auth controller:', require('./controllers/authController'));
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));