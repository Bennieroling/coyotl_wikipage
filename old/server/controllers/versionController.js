const { Version, User, Page } = require('../models');

// Create a version
const createVersion = async (req, res) => {
  try {
    const { pageId, content, comment } = req.body;
    
    const page = await Page.findByPk(pageId);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    const version = await Version.create({
      pageId,
      content,
      comment,
      createdBy: req.user.id,
    });
    
    res.status(201).json(version);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get versions for a page
const getVersionsByPageId = async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const versions = await Version.findAll({
      where: { pageId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.json(versions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get version by ID
const getVersionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const version = await Version.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
    });
    
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    res.json(version);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore a version
const restoreVersion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const version = await Version.findByPk(id);
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    const page = await Page.findByPk(version.pageId);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    // Create a new version with the current content before updating
    await Version.create({
      pageId: page.id,
      content: page.content,
      comment: 'Automatic version before restoration',
      createdBy: req.user.id,
    });
    
    // Update the page content with the version content
    page.content = version.content;
    page.updatedBy = req.user.id;
    await page.save();
    
    res.json({ message: 'Version restored successfully', page });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVersion,
  getVersionsByPageId,
  getVersionById,
  restoreVersion,
};