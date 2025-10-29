// ***********************************************
// Custom commands for Logineko authentication
// ***********************************************

// Import consolidated Keycloak commands
require('./keycloak-commands.js');

// ***********************************************
// Enhanced Custom Commands for Scalability
// ***********************************************

/**
 * Wait for element to be visible with custom timeout and retry logic
 */
Cypress.Commands.add('waitForElement', (selector, options = {}) => {
  const { timeout = 10000, retries = 3, interval = 1000 } = options;
  
  cy.get(selector, { timeout })
    .should('be.visible')
    .then(($el) => {
      if ($el.length === 0 && retries > 0) {
        cy.wait(interval);
        cy.waitForElement(selector, { timeout, retries: retries - 1, interval });
      }
    });
});

/**
 * Safe click with retry mechanism
 */
Cypress.Commands.add('safeClick', (selector, options = {}) => {
  const { timeout = 5000, retries = 3 } = options;
  
  cy.get(selector, { timeout })
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true });
});

/**
 * Fill form with validation
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[data-testid="${field}"], [name="${field}"], #${field}`)
      .clear()
      .type(value)
      .should('have.value', value);
  });
});

/**
 * Wait for API response with custom validation
 */
Cypress.Commands.add('waitForAPI', (alias, options = {}) => {
  const { timeout = 10000, statusCode = 200 } = options;
  
  cy.wait(alias, { timeout })
    .its('response.statusCode')
    .should('eq', statusCode);
});

/**
 * Take screenshot with custom naming
 */
Cypress.Commands.add('takeNamedScreenshot', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});

/**
 * Retry command with exponential backoff
 */
Cypress.Commands.add('retryCommand', (commandFn, options = {}) => {
  const { maxRetries = 3, delay = 1000 } = options;
  let retries = 0;
  
  const attempt = () => {
    return cy.wrap(null).then(() => {
      return commandFn().catch((error) => {
        retries++;
        if (retries < maxRetries) {
          cy.wait(delay * Math.pow(2, retries - 1)); // Exponential backoff
          return attempt();
        }
        throw error;
      });
    });
  };
  
  return attempt();
});

/**
 * Navigate to page with loading validation
 */
Cypress.Commands.add('navigateToPage', (url, options = {}) => {
  const { waitForSelector = 'body', timeout = 10000 } = options;
  
  cy.visit(url);
  cy.get(waitForSelector, { timeout }).should('be.visible');
  cy.url().should('include', url);
});

/**
 * Assert API response structure
 */
Cypress.Commands.add('assertAPIResponse', (alias, expectedStructure) => {
  cy.wait(alias).then((interception) => {
    const response = interception.response.body;
    
    Object.entries(expectedStructure).forEach(([key, expectedValue]) => {
      if (typeof expectedValue === 'function') {
        expectedValue(response[key]);
      } else {
        expect(response[key]).to.deep.equal(expectedValue);
      }
    });
  });
});
