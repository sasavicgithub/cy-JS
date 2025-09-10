const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://app.e2e.gcp.logineko.com',
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
      authBaseUrl: 'https://auth.e2e.gcp.logineko.com',
      realm: 'logineko',
      clientId: 'frontend-vue',
      appUrl: 'https://app.e2e.gcp.logineko.com/logineko',
      // Test user credentials
      testUsername: 'e2e_tester',
      testPassword: '9msMWtvlDp6MoJFdvI5fEAqDm4aBhiZW'
    }
  },
});
