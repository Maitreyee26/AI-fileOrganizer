const express = require('express');
const { extractUserInfo } = require('../middleware/auth');

const router = express.Router();

// Apply user extraction middleware
router.use(extractUserInfo);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userProfile = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      preferences: {
        language: 'en',
        currency: 'USD',
        country: 'US',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          expiry: true
        }
      },
      subscription: {
        plan: 'free',
        documentsLimit: 1000,
        storageLimit: '5GB',
        expiresAt: null
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString()
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const { language, currency, country, theme, notifications } = req.body;

    // Validate preferences
    const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'];
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
    const validThemes = ['light', 'dark', 'auto'];

    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    if (currency && !validCurrencies.includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme' });
    }

    // In a real app, update in database
    const updatedPreferences = {
      language: language || 'en',
      currency: currency || 'USD',
      country: country || 'US',
      theme: theme || 'light',
      notifications: notifications || {
        email: true,
        push: true,
        expiry: true
      }
    };

    res.json({
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get user activity log
router.get('/activity', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    // Mock activity data
    const activities = [
      {
        id: '1',
        type: 'document_upload',
        description: 'Uploaded Tax_Return_2023.pdf',
        timestamp: new Date().toISOString(),
        metadata: {
          documentId: 'doc_123',
          category: 'finance'
        }
      },
      {
        id: '2',
        type: 'category_change',
        description: 'Moved document to Legal category',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        metadata: {
          documentId: 'doc_124',
          oldCategory: 'miscellaneous',
          newCategory: 'legal'
        }
      },
      {
        id: '3',
        type: 'search',
        description: 'Searched for "passport"',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        metadata: {
          query: 'passport',
          resultsCount: 3
        }
      }
    ];

    res.json({
      activities: activities.slice(offset, offset + parseInt(limit)),
      total: activities.length,
      hasMore: activities.length > offset + parseInt(limit)
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to retrieve activity log' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation required' });
    }

    // In a real app, verify password and delete user data
    res.json({
      message: 'Account deletion initiated. You will receive a confirmation email.'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;