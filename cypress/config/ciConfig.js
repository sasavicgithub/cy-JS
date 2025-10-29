// CI/CD optimization configuration
export const ciConfig = {
  // Parallel execution configuration
  parallel: {
    enabled: true,
    maxWorkers: 4,
    specPattern: 'cypress/e2e/**/*.spec.js',
    excludePattern: 'cypress/e2e/**/*.skip.spec.js',
  },

  // Test grouping for parallel execution
  testGroups: {
    smoke: ['cypress/e2e/map-page.spec.js', 'cypress/e2e/warehouse-page.spec.js'],
    api: ['cypress/e2e/order-creation.spec.js', 'cypress/e2e/order-search.spec.js'],
    integration: ['cypress/e2e/**/*.spec.js'],
  },

  // Environment-specific configurations
  environments: {
    ci: {
      baseUrl: 'https://app.ci.example.com',
      timeout: 30000,
      retries: 2,
      video: true,
      screenshot: true,
      headless: true,
    },
    local: {
      baseUrl: 'https://app.local.example.com',
      timeout: 15000,
      retries: 1,
      video: false,
      screenshot: true,
      headless: false,
    },
  },

  // Performance thresholds
  performance: {
    maxTestDuration: 60000, // 1 minute
    maxPageLoadTime: 10000, // 10 seconds
    maxAPIResponseTime: 5000, // 5 seconds
    warningThresholds: {
      testDuration: 30000, // 30 seconds
      pageLoadTime: 5000, // 5 seconds
      apiResponseTime: 2000, // 2 seconds
    },
  },

  // Artifact management
  artifacts: {
    screenshots: {
      enabled: true,
      path: 'cypress/screenshots',
      onFailure: true,
      onSuccess: false,
    },
    videos: {
      enabled: true,
      path: 'cypress/videos',
      compression: true,
      maxSize: '100MB',
    },
    reports: {
      enabled: true,
      path: 'cypress/reports',
      formats: ['json', 'html', 'xml'],
    },
  },

  // Notification settings
  notifications: {
    slack: {
      enabled: false,
      webhook: process.env.SLACK_WEBHOOK_URL,
      channels: ['#test-results'],
    },
    email: {
      enabled: false,
      recipients: process.env.EMAIL_RECIPIENTS?.split(',') || [],
    },
  },
};

// Helper functions for CI/CD
export const ciHelpers = {
  getEnvironmentConfig: () => {
    const env = Cypress.env('CI') ? 'ci' : 'local';
    return ciConfig.environments[env];
  },

  getTestGroup: (groupName) => {
    return ciConfig.testGroups[groupName] || ciConfig.testGroups.integration;
  },

  shouldRunInParallel: () => {
    return ciConfig.parallel.enabled && Cypress.env('CI');
  },

  getMaxWorkers: () => {
    return ciConfig.parallel.maxWorkers;
  },

  isPerformanceAcceptable: (metrics) => {
    const thresholds = ciConfig.performance;
    return {
      testDuration: metrics.duration <= thresholds.maxTestDuration,
      pageLoadTime: metrics.pageLoadTime <= thresholds.maxPageLoadTime,
      apiResponseTime: metrics.apiResponseTime <= thresholds.maxAPIResponseTime,
    };
  },
};

export default {
  ciConfig,
  ciHelpers,
};
