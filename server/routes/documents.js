const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { extractUserInfo } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads', req.user?.id || 'anonymous');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// AI categorization function (mock implementation)
const categorizeDocument = (filename, mimetype) => {
  const categories = {
    education: ['diploma', 'degree', 'certificate', 'transcript', 'report card'],
    employment: ['payslip', 'salary', 'w2', 'w-2', 'contract', 'offer'],
    finance: ['bank', 'statement', 'loan', 'credit', 'investment'],
    medical: ['medical', 'prescription', 'health', 'vaccination', 'report'],
    utilities: ['bill', 'utility', 'electric', 'water', 'gas', 'internet'],
    property: ['lease', 'rent', 'property', 'deed', 'mortgage'],
    legal: ['passport', 'license', 'id', 'birth', 'marriage', 'ssn'],
    vehicles: ['registration', 'car', 'vehicle', 'insurance', 'puc'],
    insurance: ['insurance', 'policy', 'claim'],
    personal: ['family', 'emergency', 'personal', 'note'],
    purchases: ['invoice', 'receipt', 'warranty', 'purchase'],
    miscellaneous: []
  };

  const lowerFilename = filename.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerFilename.includes(keyword))) {
      return {
        category,
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      };
    }
  }
  
  return {
    category: 'miscellaneous',
    confidence: 0.5
  };
};

// Apply user extraction middleware to all routes
router.use(extractUserInfo);

// Upload documents
router.post('/upload', upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const documents = req.files.map(file => {
      const categorization = categorizeDocument(file.originalname, file.mimetype);
      
      return {
        id: uuidv4(),
        name: file.originalname,
        filename: file.filename,
        type: file.mimetype,
        size: file.size,
        category: categorization.category,
        confidence: categorization.confidence,
        uploadDate: new Date().toISOString(),
        userId: req.user.id,
        path: file.path,
        tags: []
      };
    });

    // In a real app, save to database
    // For now, return the document metadata
    res.json({
      message: 'Documents uploaded successfully',
      documents: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

// Get all documents for user
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    // Mock documents for demonstration
    const mockDocuments = [
      {
        id: '1',
        name: 'Tax_Return_2023.pdf',
        type: 'application/pdf',
        size: 1024000,
        category: 'finance',
        confidence: 0.95,
        uploadDate: new Date().toISOString(),
        userId: req.user.id,
        tags: ['taxes', '2023']
      },
      {
        id: '2',
        name: 'Passport_Copy.jpg',
        type: 'image/jpeg',
        size: 512000,
        category: 'legal',
        confidence: 0.98,
        uploadDate: new Date().toISOString(),
        userId: req.user.id,
        tags: ['identity']
      }
    ];

    let filteredDocuments = mockDocuments;

    if (category) {
      filteredDocuments = filteredDocuments.filter(doc => doc.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    res.json({
      documents: filteredDocuments.slice(offset, offset + parseInt(limit)),
      total: filteredDocuments.length,
      hasMore: filteredDocuments.length > offset + parseInt(limit)
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock document retrieval
    const document = {
      id: id,
      name: 'Sample_Document.pdf',
      type: 'application/pdf',
      size: 1024000,
      category: 'miscellaneous',
      confidence: 0.85,
      uploadDate: new Date().toISOString(),
      userId: req.user.id,
      tags: []
    };

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

// Update document category
router.put('/:id/category', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // In a real app, update in database
    res.json({
      message: 'Document category updated successfully',
      documentId: id,
      newCategory: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update document category' });
  }
});

// Add tags to document
router.post('/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    // In a real app, update in database
    res.json({
      message: 'Tags added successfully',
      documentId: id,
      tags: tags
    });
  } catch (error) {
    console.error('Add tags error:', error);
    res.status(500).json({ error: 'Failed to add tags' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // In a real app, delete from database and filesystem
    res.json({
      message: 'Document deleted successfully',
      documentId: id
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Search documents
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    // Mock search implementation
    const results = [
      {
        id: '1',
        name: 'Tax_Return_2023.pdf',
        category: 'finance',
        relevance: 0.95,
        snippet: 'Tax return document for year 2023...'
      }
    ];

    res.json({
      results: results,
      total: results.length,
      query: query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get document statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Mock statistics
    const stats = {
      totalDocuments: 156,
      categorizedDocuments: 142,
      recentUploads: 12,
      organizationScore: 91,
      categoryBreakdown: {
        finance: 45,
        legal: 23,
        medical: 18,
        employment: 15,
        education: 12,
        utilities: 10,
        property: 8,
        vehicles: 7,
        insurance: 6,
        personal: 5,
        purchases: 4,
        miscellaneous: 3
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

module.exports = router;