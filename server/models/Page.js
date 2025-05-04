// server/models/Page.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  content: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug from title before saving
pageSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    // Generate base slug
    let slug = slugify(this.title, {
      lower: true,
      strict: true
    });
    
    // Check if slug already exists
    const slugRegEx = new RegExp(`^(${slug})((-[0-9]*$)?)$`, 'i');
    const pagesWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    // If slug exists, add number suffix
    if (pagesWithSlug.length > 0) {
      const slugSuffixes = pagesWithSlug.map(page => {
        const match = page.slug.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      
      const nextSuffix = Math.max(...slugSuffixes) + 1;
      slug = `${slug}-${nextSuffix}`;
    }
    
    this.slug = slug;
  }
  
  // Update updatedAt timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Create text index for search
pageSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text',
  category: 'text'
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;