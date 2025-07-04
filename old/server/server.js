// /var/www/custom_wiki/server/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// Import routes with error handling
const authRoutes = require('./routes/authRoutes');
const htmlPageRoutes = require('./routes/htmlPageRoutes');
let pageRoutes, fileRoutes, versionRoutes, searchRoutes;

// Try to import routes or use placeholders
try {
  pageRoutes = require('./routes/pageRoutes');
} catch (error) {
  console.warn('Warning: pageRoutes not found. Using placeholder.');
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'Page routes not implemented yet' }));
  pageRoutes = router;
}

try {
  fileRoutes = require('./routes/fileRoutes');
} catch (error) {
  console.warn('Warning: fileRoutes not found. Using placeholder.');
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'File routes not implemented yet' }));
  fileRoutes = router;
}

try {
  versionRoutes = require('./routes/versionRoutes');
} catch (error) {
  console.warn('Warning: versionRoutes not found. Using placeholder.');
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'Version routes not implemented yet' }));
  versionRoutes = router;
}

try {
  searchRoutes = require('./routes/searchRoutes');
} catch (error) {
  console.warn('Warning: searchRoutes not found. Using placeholder.');
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'Search routes not implemented yet' }));
  searchRoutes = router;
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/html-docs', express.static(path.join(__dirname, '../html-docs')));

const htmlDocsRoutes = require('./routes/htmlDocsRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/html-pages', htmlPageRoutes);
app.use('/api/html-pages', htmlPageRoutes);
app.use('/api/html-docs', htmlDocsRoutes);


// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Server Error', 
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize server - SINGLE FUNCTION DECLARATION
const initializeServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connection established');
    
    // Sync all models (be careful with force: true in production)
    await sequelize.sync({ force: false }); // Changed to false to preserve data
    console.log('Database tables synchronized');
    
    // Setup full-text search if the function exists
    try {
      const { setupFullTextSearch } = require('./models/Page');
      await setupFullTextSearch();
      console.log('Full-text search setup completed');
    } catch (error) {
      console.warn('Full-text search setup skipped:', error.message);
    }
    
    // Start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

// Start the server
initializeServer();