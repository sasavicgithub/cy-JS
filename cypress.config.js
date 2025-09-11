const { defineConfig } = require('cypress');

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
      // Environment variables for authentication
      authBaseUrl: process.env.CYPRESS_AUTH_BASE_URL || 'https://auth.e2e.gcp.logineko.com',
      realm: process.env.CYPRESS_REALM || 'logineko',
      clientId: process.env.CYPRESS_CLIENT_ID || 'frontend-vue',
      appUrl: process.env.CYPRESS_APP_URL || 'https://app.e2e.gcp.logineko.com/logineko',
      // Test user credentials
      testUsername: process.env.CYPRESS_TEST_USERNAME || 'e2e_tester',
      testPassword: process.env.CYPRESS_TEST_PASSWORD || '9msMWtvlDp6MoJFdvI5fEAqDm4aBhiZW',
    },
  },
});
