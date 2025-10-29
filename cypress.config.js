const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Add custom tasks for reporting
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      // Add plugins for better reporting
      on('after:run', (results) => {
        console.log('Test run completed:', {
          totalTests: results.totalTests,
          totalPassed: results.totalPassed,
          totalFailed: results.totalFailed,
          totalSkipped: results.totalSkipped,
          duration: results.totalDuration,
        });
      });
    },

    // Environment configuration
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://app.e2e.gcp.logineko.com',

    // Viewport configuration
    viewportWidth: 1280,
    viewportHeight: 720,

    // Timeout configuration
    defaultCommandTimeout: parseInt(process.env.CYPRESS_COMMAND_TIMEOUT) || 15000,
    requestTimeout: parseInt(process.env.CYPRESS_REQUEST_TIMEOUT) || 15000,
    responseTimeout: parseInt(process.env.CYPRESS_RESPONSE_TIMEOUT) || 15000,
    pageLoadTimeout: parseInt(process.env.CYPRESS_PAGE_LOAD_TIMEOUT) || 30000,

    // Retry configuration
    retries: {
      runMode: parseInt(process.env.CYPRESS_RETRIES) || 2,
      openMode: 0,
    },

    // Video and screenshot configuration
    video: process.env.CYPRESS_VIDEO === 'true',
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    // Security configuration
    chromeWebSecurity: false, // Required for cross-origin requests

    // Spec pattern
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
    excludeSpecPattern: 'cypress/e2e/**/*.skip.{cy,spec}.{js,ts}',

    // Support file
    supportFile: 'cypress/support/e2e.js',

    // Fixtures
    fixturesFolder: 'cypress/fixtures',

    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // Downloads
    downloadsFolder: 'cypress/downloads',

    // Environment variables
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
      // Environment
      environment: process.env.CYPRESS_ENVIRONMENT || 'development',
      // CI/CD flags
      ci: process.env.CI === 'true',
      // Performance thresholds
      maxTestDuration: parseInt(process.env.CYPRESS_MAX_TEST_DURATION) || 60000,
      maxPageLoadTime: parseInt(process.env.CYPRESS_MAX_PAGE_LOAD_TIME) || 10000,
      // Reporting
      generateReports: process.env.CYPRESS_GENERATE_REPORTS === 'true',
      // Parallel execution
      parallel: process.env.CYPRESS_PARALLEL === 'true',
      // Debug mode
      debug: process.env.CYPRESS_DEBUG === 'true',
    },
  },
});
