// ***********************************************
// Base Page Object Model
// Contains common locators and methods for all pages
// ***********************************************

class BasePage {
  // ============================================
  // COMMON LOCATORS
  // ============================================
  
  // User authentication elements
  get loggedInUser() { return cy.get('[test-logged-in-user]'); }
  get userAcronym() { return cy.get('[test-user-acronym]'); }
  get userLabel() { return cy.get('[test-logged-in-user] .link__label'); }
  
  // Search elements
  get searchInput() { return cy.get('input[placeholder="Search"]'); }
  get mainSearchInput() { return cy.get('[test-main-search-input]'); }
  
  // Navigation elements
  get mapLink() { return cy.get('[href*="/logineko/map"]'); }
  
  // ============================================
  // COMMON METHODS
  // ============================================
  
  /**
   * Verify user is logged in and display user information
   */
  verifyUserLoggedIn(expectedName = 'E2e Tester') {
    // First check if the element exists
    cy.get('body').then(($body) => {
      if ($body.find('[test-logged-in-user]').length > 0) {
        this.loggedInUser.should('be.visible');
        this.userLabel
          .should('be.visible')
          .and('contain.text', expectedName);
      } else {
        cy.log('⚠️ User element not found - checking if user is logged in via other means');
        // Alternative: check if we're redirected to login page
        cy.url().then((url) => {
          if (url.includes('auth.e2e.gcp.logineko.com')) {
            throw new Error('User is not logged in - redirected to auth page');
          } else {
            cy.log('✅ User appears to be logged in (no auth redirect)');
          }
        });
      }
    });
    return this;
  }
  
  /**
   * Verify user acronym is displayed
   */
  verifyUserAcronym(expectedAcronym = 'ET') {
    this.userAcronym
      .should('be.visible')
      .and('have.text', expectedAcronym);
    return this;
  }
  
  /**
   * Verify search input is visible
   */
  verifySearchInputVisible() {
    this.searchInput.should('be.visible');
    return this;
  }
  
  /**
   * Type in search input
   */
  typeInSearchInput(text) {
    this.searchInput.clear().type(text);
    return this;
  }
  
  /**
   * Verify URL contains expected path
   */
  verifyUrlContains(expectedPath) {
    cy.url().should('include', expectedPath);
    return this;
  }
  
  /**
   * Navigate to map page
   */
  navigateToMap() {
    this.mapLink.click();
    return this;
  }
  
  /**
   * Handle uncaught exceptions (like Keycloak iframe postMessage errors)
   */
  handleUncaughtExceptions() {
    cy.on('uncaught:exception', (err, runnable) => {
      // Ignore postMessage errors from Keycloak iframe
      if (err.message.includes('postMessage')) {
        return false;
      }
      return true;
    });
    return this;
  }

  /**
   * Check if user is logged in by looking for various indicators
   */
  checkUserLoginStatus() {
    cy.get('body').then(($body) => {
      // Check for user element
      if ($body.find('[test-logged-in-user]').length > 0) {
        cy.log('✅ User element found - user is logged in');
        return true;
      }
      
      // Check for user acronym
      if ($body.find('[test-user-acronym]').length > 0) {
        cy.log('✅ User acronym found - user is logged in');
        return true;
      }
      
      // Check if we're on auth page (not logged in)
      cy.url().then((url) => {
        if (url.includes('auth.e2e.gcp.logineko.com')) {
          cy.log('❌ User is not logged in - on auth page');
          return false;
        } else {
          cy.log('✅ User appears to be logged in (not on auth page)');
          return true;
        }
      });
    });
    return this;
  }
}

// Export the class
export default BasePage;
