const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://app.e2e.gcp.logineko.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false, // Required for cross-origin requests
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
    env: {
      // Base URL for API calls
      baseUrl: process.env.CYPRESS_BASE_URL,
      // Authentication URLs
      authBaseUrl: process.env.CYPRESS_AUTH_BASE_URL,
      appUrl: process.env.CYPRESS_APP_URL,
      // Keycloak Configuration
      realm: process.env.CYPRESS_REALM,
      clientId: process.env.CYPRESS_CLIENT_ID,
      // Test User Credentials
      testUsername: process.env.CYPRESS_TEST_USERNAME,
      testPassword: process.env.CYPRESS_TEST_PASSWORD,
    },
  },
});
