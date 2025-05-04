
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const fileRoutes = require('./routes/fileRoutes');

// CORS with specific options

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative development port
  'https://your-production-domain.com' // Production URL
];

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/custom-wiki', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Include both localhost and 127.0.0.1
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/files', fileRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Temp simple test endpoint to verify basic connectivity
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));