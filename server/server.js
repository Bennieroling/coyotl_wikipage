const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db'); // Import both connectDB and sequelize
const versionRoutes = require('./routes/versionRoutes');
const searchRoutes = require('./routes/searchRoutes');
const { setupFullTextSearch } = require('./models/Page');

// Import routes
const authRoutes = require('./routes/authRoutes');
let pageRoutes, fileRoutes;

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

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/pages', pageRoutes);
app.use('/files', fileRoutes);
app.use('/versions', versionRoutes);
app.use('/search', searchRoutes);


// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Server Error', 
    details: err.message 
  });
});

// Initialize server
async function initializeServer() {
  try {
    // Connect to database
    await connectDB();
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');
    
    // Start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
}
const initializeServer = async () => {
  try {
    await connectDB();
    // After models are synced
    await setupFullTextSearch();
    
    // Rest of your server initialization
  } catch (error) {
    console.error('Server initialization error:', error);
  }
};


// Start the server
initializeServer();