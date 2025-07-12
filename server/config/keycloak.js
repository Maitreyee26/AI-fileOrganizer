const Keycloak = require('keycloak-connect');

let keycloak;

function setupKeycloak(app) {
  const keycloakConfig = {
    realm: process.env.KEYCLOAK_REALM || 'document-organizer',
    'auth-server-url': process.env.KEYCLOAK_URL || 'http://localhost:8080',
    'ssl-required': 'external',
    resource: process.env.KEYCLOAK_CLIENT_ID || 'document-organizer-client',
    'public-client': false,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET
    },
    'use-resource-role-mappings': true,
    'confidential-port': 0
  };

  keycloak = new Keycloak({}, keycloakConfig);

  // Install Keycloak middleware
  app.use(keycloak.middleware({
    logout: '/api/auth/logout',
    admin: '/api/admin'
  }));

  return keycloak;
}

function getKeycloak() {
  if (!keycloak) {
    throw new Error('Keycloak has not been initialized');
  }
  return keycloak;
}

module.exports = {
  setupKeycloak,
  getKeycloak
};