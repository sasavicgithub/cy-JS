# LoginEKO Cypress E2E Testing Project

This project contains end-to-end (E2E) tests for the LoginEKO application using Cypress testing framework.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Scenarios](#test-scenarios)
- [Development](#development)
- [CI/CD](#cicd)
- [Test Reports](#test-reports)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18 or higher - required for Cypress 15.1.0)
- **npm** (comes with Node.js)
- **Git**

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd login_cy
   ```

2. **Install dependencies:**

```bash
npm install
```

3. **Install Cypress (if not already installed):**

   ```bash
   npx cypress install
   ```

4. **Set up environment variables:**

   ```bash
   # Copy the example environment file
   cp .envExample .env

   # Edit .env with your actual credentials
   # (See Configuration section for details)
   ```

5. **Verify installation:**
   ```bash
   # Run a quick test to verify everything is working
   npx cypress run --spec "cypress/e2e/map-page.spec.js"
   ```

## ⚙️ Configuration

### Environment Variables

The project uses environment variables for configuration. These are automatically loaded from GitHub Secrets in CI/CD or can be set locally:

**For Local Development:**
Create a `.env` file in the project root:

```bash
# Base URL for API calls
CYPRESS_BASE_URL=https://app.e2e.gcp.logineko.com

# Authentication URLs
CYPRESS_AUTH_BASE_URL=https://auth.e2e.gcp.logineko.com
CYPRESS_APP_URL=https://app.e2e.gcp.logineko.com/logineko

# Keycloak Configuration
CYPRESS_REALM=logineko
CYPRESS_CLIENT_ID=frontend-vue

# Test User Credentials (REQUIRED - no fallbacks)
CYPRESS_TEST_USERNAME=e2e_tester
CYPRESS_TEST_PASSWORD=your_test_password
```

**For CI/CD:**
Set these as GitHub Secrets in your repository settings.

### Cypress Configuration

The main configuration is in `cypress.config.js`:

- **Base URL:** `https://app.e2e.gcp.logineko.com` (configurable via environment variables)
- **Viewport:** 1280x720
- **Timeouts:** 
  - Command timeout: 15 seconds (configurable)
  - Request timeout: 15 seconds (configurable)
  - Response timeout: 15 seconds (configurable)
  - Page load timeout: 30 seconds (configurable)
- **Retry Configuration:** 
  - Run mode: 2 retries (configurable)
  - Open mode: 0 retries
- **Chrome Web Security:** Disabled for cross-origin requests
- **Environment-specific settings:** Supports dev, staging, and production environments

### Additional Environment Variables

```bash
# Optional Configuration
CYPRESS_ENVIRONMENT=development          # development, staging, production
CYPRESS_COMMAND_TIMEOUT=15000           # Command timeout in ms
CYPRESS_REQUEST_TIMEOUT=15000           # Request timeout in ms
CYPRESS_RESPONSE_TIMEOUT=15000          # Response timeout in ms
CYPRESS_PAGE_LOAD_TIMEOUT=30000        # Page load timeout in ms
CYPRESS_RETRIES=2                       # Number of retries
CYPRESS_VIDEO=false                     # Enable/disable video recording
CYPRESS_MAX_TEST_DURATION=60000        # Performance threshold
CYPRESS_MAX_PAGE_LOAD_TIME=10000        # Performance threshold
CYPRESS_GENERATE_REPORTS=true           # Enable test reporting
CYPRESS_PARALLEL=false                  # Enable parallel execution
CYPRESS_DEBUG=false                     # Enable debug mode
```

## 🚀 Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npx cypress open
```

This opens the Cypress Test Runner where you can:

- Select tests to run
- Watch tests execute in real-time
- Debug tests interactively

### Run Tests in Headless Mode

```bash
# Run all tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/map-page.spec.js"

# Run all test files
npx cypress run --spec "cypress/e2e/*.spec.js"

# Run tests in specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge

# Run tests with video recording
npx cypress run --record

# Run tests with specific viewport
npx cypress run --config viewportWidth=1920,viewportHeight=1080
```

### Run Tests with Custom Configuration

```bash
# Run tests with custom base URL
npx cypress run --config baseUrl=https://staging.app.logineko.com

# Run tests with custom timeout
npx cypress run --config defaultCommandTimeout=15000
```

## 📁 Project Structure

```
login_cy/
├── cypress/
│   ├── e2e/                    # Test files (AAA pattern)
│   │   ├── map-page.spec.js    # Map page tests
│   │   ├── warehouse-page.spec.js # Warehouse page tests
│   │   ├── order-creation.spec.js # Order creation tests
│   │   └── order-search.spec.js   # Order search tests
│   ├── fixtures/               # Test data
│   │   └── testData.js         # Centralized test data
│   ├── config/                 # Configuration files
│   │   ├── environments.js     # Environment-specific configs
│   │   └── ciConfig.js         # CI/CD optimization configs
│   ├── factories/              # Test data factories
│   │   └── dataFactories.js   # Dynamic data generation
│   ├── utils/                  # Utility functions
│   │   ├── testUtils.js       # Common utilities
│   │   ├── errorHandler.js    # Error handling & retries
│   │   └── testReporter.js    # Reporting & analytics
│   ├── pages/                 # Page Object Model
│   │   ├── basePage.js        # Base page class
│   │   ├── mapPage.js         # Map page object
│   │   └── warehousePage.js   # Warehouse page object
│   ├── Service/               # API services
│   │   └── Helper/
│   │       └── userService.js # User/API service methods
│   ├── support/               # Support files
│   │   ├── commands.js        # Custom Cypress commands
│   │   ├── e2e.js            # E2E support file
│   │   └── keycloak-commands.js # Authentication commands
│   ├── screenshots/           # Screenshot artifacts
│   ├── videos/                # Video artifacts
│   ├── downloads/            # Download artifacts
│   └── reports/               # Test reports & analytics
├── .github/
│   └── workflows/
│       └── cypress-tests.yml  # GitHub Actions workflow
├── cypress.config.js          # Cypress configuration
├── eslint.config.mjs          # ESLint configuration (flat config)
├── .prettierrc               # Prettier configuration
├── .gitignore               # Git ignore rules
├── .env                     # Environment variables (local development)
├── .envExample              # Example environment variables
└── package.json             # Project dependencies
```

## 🧪 Test Scenarios

### Test Organization (AAA Pattern)

All tests follow the **Arrange, Act, Assert** pattern for better readability and maintainability:

```javascript
it('should do something', () => {
  // Arrange - Set up test data and preconditions
  // Act - Execute the action being tested  
  // Assert - Verify the expected outcomes
});
```

### 1. Map Page Tests

- **Purpose:** Verify user authentication and map page functionality
- **File:** `cypress/e2e/map-page.spec.js`
- **Tests:**
  - User login and authentication
  - Map page loading and display
  - User information verification

### 2. Warehouse Page Tests

- **Purpose:** Test warehouse receive page functionality
- **File:** `cypress/e2e/warehouse-page.spec.js`
- **Tests:**
  - Warehouse page navigation
  - User authentication verification
  - Search input visibility

### 3. Order Creation Tests

- **Purpose:** Test API integration for order creation
- **File:** `cypress/e2e/order-creation.spec.js`
- **Tests:**
  - ✅ Create receive orders via API with dynamic location selection
  - ✅ Fetch available locations from API and log available data
  - ✅ Order creation verification and navigation to warehouse page
  - ✅ Cross-test data sharing using Cypress aliases

### 4. Order Search Tests

- **Purpose:** Test order search functionality
- **File:** `cypress/e2e/order-search.spec.js`
- **Tests:**
  - ✅ Order search functionality on warehouse page
  - ✅ Order status verification ("To-Do" status)
  - ✅ Order number verification
  - ✅ All tests passing locally (4/4 tests successful)

## 🔄 CI/CD

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/cypress-tests.yml`) that:

- **Triggers:** Push to main/master, pull requests, manual dispatch
- **Browser:** Chrome (optimized for headless mode)
- **Features:**
  - Automated test execution
  - Artifact upload (screenshots, videos, reports)
  - Caching for faster builds
  - Security and lint checks
  - Environment variable management via GitHub Secrets

### Manual Trigger Options

When triggering manually from GitHub Actions, you can choose:

- **Test Type:** all, map-tests, warehouse-tests, order-creation-tests, order-search-tests
- **Browser:** chrome (only)

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

- `CYPRESS_BASE_URL`
- `CYPRESS_AUTH_BASE_URL`
- `CYPRESS_REALM`
- `CYPRESS_CLIENT_ID`
- `CYPRESS_APP_URL`
- `CYPRESS_TEST_USERNAME`
- `CYPRESS_TEST_PASSWORD`

## 🛠️ Development

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Cypress ESLint Plugin** for Cypress-specific rules
- **dotenv** for environment variable loading

### Running Linters

```bash
# Run ESLint
npx eslint cypress/ --ext .js

# Run Prettier
npx prettier --check cypress/

# Fix Prettier issues
npx prettier --write cypress/
```

### Page Object Model

The project follows the Page Object Model pattern:

- **BasePage:** Common functionality and locators
- **MapPage:** Map-specific page interactions
- **WarehousePage:** Warehouse page interactions
- **UserService:** API service methods

### Test Data Management

- **Centralized Data:** All test data is stored in `cypress/fixtures/testData.js`
- **Data Categories:** Order creation, API endpoints, status codes, user data, UI elements
- **Easy Maintenance:** Change values in one place, affects all tests
- **Environment Flexibility:** Easy to create different data sets for different environments

### Test Data Factories

The project includes dynamic test data factories (`cypress/factories/dataFactories.js`):

- **OrderDataFactory:** Generate order data with overrides
  - `createReceiveOrder(overrides)` - Create standard order
  - `createRandomOrder()` - Generate random order data
  - `createOrderWithCustomLocation(locationCode)` - Custom location orders

- **UserDataFactory:** Generate test user data
  - `createTestUser(overrides)` - Standard test user
  - `createAdminUser()` - Admin user with elevated permissions

- **APIDataFactory:** Generate API response mocks
  - `createSuccessResponse(data)` - Success response structure
  - `createErrorResponse(status, message)` - Error response structure

### Custom Commands

Enhanced custom commands (`cypress/support/commands.js`):

- `cy.waitForElement(selector, options)` - Wait with retry logic
- `cy.safeClick(selector, options)` - Safe click with validation
- `cy.fillForm(formData)` - Fill forms with validation
- `cy.waitForAPI(alias, options)` - Wait for API with validation
- `cy.takeNamedScreenshot(name)` - Screenshot with timestamp
- `cy.retryCommand(commandFn, options)` - Retry with exponential backoff
- `cy.navigateToPage(url, options)` - Navigate with loading validation
- `cy.assertAPIResponse(alias, expectedStructure)` - API response validation

### Utility Functions

Comprehensive utility library (`cypress/utils/testUtils.js`):

- **Data Generation:** Random strings, emails, numbers
- **Date Utilities:** Current date, future dates, formatting
- **String Utilities:** Capitalization, sanitization
- **Array Utilities:** Random selection, shuffling
- **Object Utilities:** Deep merge, empty value removal
- **Validation:** Email, URL validation
- **Performance:** Performance measurement utilities

### Error Handling & Retry Mechanisms

Robust error handling (`cypress/utils/errorHandler.js`):

- **ErrorHandler:** Retry operations with exponential backoff
- **TestRetryManager:** Pre-configured retry strategies
- **Retryable Error Detection:** Automatic detection of transient errors
- **Context-Aware Logging:** Detailed error information with context

### Test Reporting & Analytics

Advanced reporting system (`cypress/utils/testReporter.js`):

- **TestReporter:** Track test results, generate reports
- **PerformanceMonitor:** Monitor test execution times
- **TestAnalytics:** Track page load times, API response times, element wait times
- **Flakiness Tracking:** Monitor test stability over time
- **JSON Reports:** Detailed reports saved to `cypress/reports/`

### Environment Configuration

Environment-specific settings (`cypress/config/environments.js`):

- **Multi-Environment Support:** Development, staging, production
- **Dynamic Configuration:** Environment-based timeout and retry settings
- **Easy Switching:** Change environment via `CYPRESS_ENVIRONMENT` variable

### CI/CD Optimization

CI/CD configuration (`cypress/config/ciConfig.js`):

- **Parallel Execution:** Configurable parallel test execution
- **Test Grouping:** Smoke, API, and integration test groups
- **Performance Thresholds:** Max test duration, page load time, API response time
- **Artifact Management:** Screenshot, video, and report configuration
- **Notification Settings:** Slack and email integration support

### Code Quality Features

- **AAA Pattern:** All tests organized with Arrange, Act, Assert sections
- **Separated Concerns:** Each test file focuses on specific functionality
- **Data-Driven:** Tests use centralized data instead of hardcoded values
- **Consistent Structure:** All tests follow the same organizational pattern
- **Scalable Architecture:** Modular design for easy expansion
- **Maintainable Code:** Reusable utilities and custom commands

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failures:**
   - Verify test credentials in environment variables
   - Check if the test environment is accessible
   - Ensure Keycloak authentication is working
   - Verify GitHub Secrets are properly set for CI/CD

2. **Test Timeouts:**
   - Tests now use progressive loading with proper timeouts (15s for table loading)
   - Check network connectivity
   - Verify application response times

3. **Element Not Found (Warehouse Page):**
   - Tests now use stable selectors based on actual HTML structure
   - Progressive loading ensures table data is fully loaded before verification
   - Selectors: `.table__row .cell__text` for order numbers, `.table__row .cell--status .cell__text` for status

4. **API Failures:**
   - Verify API endpoints are accessible
   - Check authentication tokens
   - Review API response formats
   - Location API now properly handles nested response structure

5. **GitHub Actions Issues:**
   - Ensure all required secrets are set in repository settings
   - Check Node.js version compatibility (18+ required for Cypress 15.1.0)
   - Verify workflow file syntax and permissions

### Debug Mode

Run tests in debug mode for detailed information:

```bash
# Open Cypress in debug mode
npx cypress open --config video=false

# Run specific test with debug output
npx cypress run --spec "cypress/e2e/map-page.spec.js" --headed

# Run all tests with debug output
npx cypress run --spec "cypress/e2e/*.spec.js" --headed
```

### Logs and Artifacts

- **Screenshots:** Automatically captured on test failures
- **Videos:** Recorded for all test runs (can be disabled)
- **Console Logs:** Available in Cypress Test Runner
- **Network Requests:** Visible in browser dev tools

## 📊 Test Reports

Test results are available in:

- **Cypress Test Runner:** Real-time results
- **Terminal Output:** Summary after headless runs
- **GitHub Actions:** Detailed reports in CI/CD
- **Artifacts:** Screenshots and videos uploaded to GitHub
- **JSON Reports:** Detailed test reports in `cypress/reports/test-report.json`
- **Analytics Reports:** Performance analytics in `cypress/reports/analytics-report.json`

### Report Features

- **Test Metrics:** Pass/fail/skip counts, duration, pass rate
- **Performance Metrics:** Average and slowest test durations
- **API Performance:** Response time tracking and analysis
- **Element Wait Times:** Performance monitoring for element interactions
- **Test Flakiness:** Track unstable tests over time
- **Page Load Performance:** Monitor page load times

### Generating Reports

Reports are automatically generated when `CYPRESS_GENERATE_REPORTS=true`:

```bash
# Enable reporting
export CYPRESS_GENERATE_REPORTS=true
npx cypress run

# Reports will be saved to:
# - cypress/reports/test-report.json
# - cypress/reports/analytics-report.json
```

## 🚀 Advanced Features

### Parallel Execution

Run tests in parallel for faster execution:

```bash
# Enable parallel execution
export CYPRESS_PARALLEL=true
npx cypress run --parallel

# Or use Cypress Dashboard for parallel execution
npx cypress run --record --parallel
```

### Environment-Specific Execution

Run tests against different environments:

```bash
# Development environment
export CYPRESS_ENVIRONMENT=development
npx cypress run

# Staging environment
export CYPRESS_ENVIRONMENT=staging
npx cypress run

# Production environment
export CYPRESS_ENVIRONMENT=production
npx cypress run
```

### Performance Monitoring

Monitor test performance:

```bash
# Enable performance monitoring
export CYPRESS_MAX_TEST_DURATION=60000
export CYPRESS_MAX_PAGE_LOAD_TIME=10000
npx cypress run
```

### Using Test Data Factories

Generate dynamic test data:

```javascript
import { OrderDataFactory } from '../factories/dataFactories.js';

// Create standard order
const order = OrderDataFactory.createReceiveOrder();

// Create random order
const randomOrder = OrderDataFactory.createRandomOrder();

// Create order with custom location
const customOrder = OrderDataFactory.createOrderWithCustomLocation('LOC001');
```

### Using Utility Functions

Leverage utility functions for common operations:

```javascript
import TestUtils from '../utils/testUtils.js';

// Generate random data
const randomEmail = TestUtils.generateRandomEmail();
const randomString = TestUtils.generateRandomString(10);

// Date operations
const currentDate = TestUtils.getCurrentDate('YYYY-MM-DD');
const futureDate = TestUtils.getFutureDate(7);

// Validation
const isValid = TestUtils.isValidEmail('test@example.com');
```

### Error Handling & Retries

Use retry mechanisms for flaky tests:

```javascript
import { TestRetryManager } from '../utils/errorHandler.js';

// Retry element operation
await TestRetryManager.retryElementOperation(() => {
  cy.get('.element').should('be.visible');
});

// Retry API call
await TestRetryManager.retryAPICall(() => {
  cy.request('GET', '/api/endpoint');
});
```
