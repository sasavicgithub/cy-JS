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

- **Node.js** (version 16 or higher)
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

## ⚙️ Configuration

### Environment Variables

The project uses environment variables for configuration. These are set in `cypress.config.js`:

```javascript
env: {
  authBaseUrl: 'https://auth.e2e.gcp.logineko.com',
  realm: 'logineko',
  clientId: 'frontend-vue',
  appUrl: 'https://app.e2e.gcp.logineko.com/logineko',
  testUsername: 'e2e_tester',
  testPassword: '9msMWtvlDp6MoJFdvI5fEAqDm4aBhiZW'
}
```

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
├── eslint.config.mjs          # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore               # Git ignore rules
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
  - Create receive orders via API
  - Random location selection
  - Order search functionality
  - Order status verification

## 🔄 CI/CD

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/cypress-tests.yml`) that:

- **Triggers:** Push to main/master, pull requests, manual dispatch
- **Browsers:** Chrome, Firefox, Edge
- **Features:**
  - Multi-browser testing
  - Artifact upload (screenshots, videos, reports)
  - Caching for faster builds
  - Security and lint checks

### Manual Trigger Options

When triggering manually from GitHub Actions, you can choose:
- **Test Type:** all, map-tests, warehouse-tests, order-creation-tests
- **Browser:** chrome, firefox, edge, electron
- **Headless Mode:** true/false

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
   - Verify test credentials in `cypress.config.js`
   - Check if the test environment is accessible
   - Ensure Keycloak authentication is working

2. **Test Timeouts:**
   - Increase timeout values in `cypress.config.js`
   - Check network connectivity
   - Verify application response times

3. **Element Not Found:**
   - Update selectors in page objects
   - Add proper waits for dynamic content
   - Check if the application UI has changed

4. **API Failures:**
   - Verify API endpoints are accessible
   - Check authentication tokens
   - Review API response formats

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



