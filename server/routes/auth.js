const express = require('express');
const jwt = require('jsonwebtoken');
const { getKeycloak } = require('../config/keycloak');
const { extractUserInfo } = require('../middleware/auth');

const router = express.Router();

// Login endpoint (redirects to Keycloak)
router.get('/login', (req, res) => {
  const keycloak = getKeycloak();
  const loginURL = keycloak.loginUrl(req.session.id, req.get('Referer') || '/');
  res.json({ loginUrl: loginURL });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  const keycloak = getKeycloak();
  
  if (req.kauth && req.kauth.grant) {
    keycloak.deauthenticated(req);
    req.session.destroy();
  }
  
  res.json({ message: 'Logged out successfully' });
});

// Get current user info
router.get('/me', extractUserInfo, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    user: req.user,
    authenticated: true
  });
});

// Token refresh endpoint
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  try {
    const keycloak = getKeycloak();
    // In a real implementation, you would use Keycloak's token refresh
    // For now, we'll return a mock response
    res.json({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  const isAuthenticated = req.kauth && req.kauth.grant;
  
  res.json({
    authenticated: !!isAuthenticated,
    user: isAuthenticated ? req.user : null
  });
});

module.exports = router;