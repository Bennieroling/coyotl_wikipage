// server/controllers/fileController.js
const File = require('../models/File');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const fileTypes = /jpeg|jpg|png|gif|svg|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md|html|css|js|json/;
  
  // Check extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = fileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, documents, and common web files are allowed'));
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single('file');

// Upload file
exports.uploadFile = (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // Multer error (e.g., file too large)
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other error
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
      // Create file record in database
      const file = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedBy: req.user.id
      });
      
      await file.save();
      
      // Return file details
      res.status(201).json(file);
    } catch (error) {
      console.error('Error saving file record:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

// Get list of files
exports.getFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await File.countDocuments();
    
    // Get files with pagination
    const files = await File.find()
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'username');
    
    res.json({
      files,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get file by ID
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if user is the uploader or an admin
    if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }
    
    // Delete file from disk
    fs.unlink(file.path, async (err) => {
      if (err) {
        console.error('Error deleting file from disk:', err);
      }
      
      // Delete file record from database
      await file.remove();
      
      res.json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Server error' });
  }
};