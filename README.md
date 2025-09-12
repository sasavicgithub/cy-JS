# LoginEKO Cypress E2E Testing Project

This project contains end-to-end (E2E) tests for the LoginEKO application using Cypress testing framework.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Scenarios](#test-scenarios)
- [CI/CD](#cicd)
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
   cp cypress/fixtures/.envExample .env

   # Edit .env with your actual credentials
   # (See Configuration section for details)
   ```

5. **Verify installation:**
   ```bash
   # Run a quick test to verify everything is working
   npx cypress run --spec "cypress/e2e/map.spec.js"
   ```

## ⚙️ Configuration

### Environment Variables

The project uses environment variables for configuration. These are automatically loaded from GitHub Secrets in CI/CD or can be set locally:

**For Local Development:**
Create a `.env` file in the project root:

```bash
CYPRESS_BASE_URL=https://app.e2e.gcp.logineko.com
CYPRESS_AUTH_BASE_URL=https://auth.e2e.gcp.logineko.com
CYPRESS_REALM=logineko
CYPRESS_CLIENT_ID=frontend-vue
CYPRESS_APP_URL=https://app.e2e.gcp.logineko.com/logineko
CYPRESS_TEST_USERNAME=e2e_tester
CYPRESS_TEST_PASSWORD=your_test_password
```

**For CI/CD:**
Set these as GitHub Secrets in your repository settings.

### Cypress Configuration

The main configuration is in `cypress.config.js`:

- **Base URL:** `https://app.e2e.gcp.logineko.com`
- **Viewport:** 1280x720
- **Timeouts:** 10 seconds for commands, requests, and responses
- **Chrome Web Security:** Disabled for cross-origin requests

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
npx cypress run --spec "cypress/e2e/map.spec.js"

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
│   ├── e2e/                    # Test files
│   │   └── map.spec.js        # Main test suite
│   ├── fixtures/              # Test data
│   │   └── example.json
│   ├── pages/                 # Page Object Model
│   │   ├── basePage.js        # Base page class
│   │   ├── mapPage.js         # Map page object
│   │   └── warehousePage.js   # Warehouse page object
│   ├── Service/               # API services
│   │   └── Helper/
│   │       └── userService.js # User/API service methods
│   └── support/               # Support files
│       ├── commands.js        # Custom Cypress commands
│       ├── e2e.js            # E2E support file
│       └── keycloak-commands.js # Authentication commands
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

### 1. Map Page Tests

- **Purpose:** Verify user authentication and map page functionality
- **File:** `cypress/e2e/map.spec.js`
- **Tests:**
  - User login and authentication
  - Map page loading and display
  - User information verification

### 2. Warehouse Page Tests

- **Purpose:** Test warehouse receive page functionality
- **File:** `cypress/e2e/map.spec.js`
- **Tests:**
  - Warehouse page navigation
  - User authentication verification
  - Search input visibility

### 3. Order Creation and Search Tests

- **Purpose:** Test API integration and order management
- **File:** `cypress/e2e/map.spec.js`
- **Tests:**
  - Create receive orders via API with dynamic location selection
  - Fetch available locations from API and randomly select one
  - Order search functionality on warehouse page
  - Order status verification ("To-Do" status)
  - Cross-test data sharing using Cypress aliases

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

- **Test Type:** all, map-tests, warehouse-tests, order-creation-tests
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
npx cypress run --spec "cypress/e2e/map.spec.js" --headed
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
