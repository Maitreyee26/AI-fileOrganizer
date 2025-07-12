const jwt = require('jsonwebtoken');
const { getKeycloak } = require('../config/keycloak');

// JWT-based authentication middleware (fallback)
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header required' });
  }
};

// Keycloak role-based authorization
const requireRole = (role) => {
  return (req, res, next) => {
    const keycloak = getKeycloak();
    
    if (keycloak.hasRole(req, role)) {
      next();
    } else {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRole: role 
      });
    }
  };
};

// Extract user info from Keycloak token
const extractUserInfo = (req, res, next) => {
  try {
    if (req.kauth && req.kauth.grant) {
      const token = req.kauth.grant.access_token;
      const content = token.content;
      
      req.user = {
        id: content.sub,
        username: content.preferred_username,
        email: content.email,
        firstName: content.given_name,
        lastName: content.family_name,
        roles: content.realm_access?.roles || []
      };
    }
    next();
  } catch (error) {
    console.error('Error extracting user info:', error);
    res.status(500).json({ error: 'Failed to extract user information' });
  }
};

module.exports = {
  authenticateJWT,
  requireRole,
  extractUserInfo
};