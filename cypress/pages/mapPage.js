// ***********************************************
// Map Page Object Model
// Contains all locators and methods for the Map page
// ***********************************************

import BasePage from './basePage.js';

class MapPage extends BasePage {
  // ============================================
  // MAP SPECIFIC LOCATORS
  // ============================================
  
  // Map specific elements
  get mapContainer() { return cy.get('[test-map-container]'); }
  get mapZoomIn() { return cy.get('[test-zoom-in]'); }
  get mapZoomOut() { return cy.get('[test-zoom-out]'); }
  
  // ============================================
  // METHODS
  // ============================================
  
  /**
   * Visit the map page
   */
  visitMapPage() {
    cy.visit(Cypress.env('appUrl') + '/map');
    return this;
  }
  
  
  /**
   * Verify main search input is visible
   */
  verifyMainSearchInputVisible() {
    this.mainSearchInput.should('be.visible');
    return this;
  }
  
  /**
   * Type in main search input
   */
  typeInMainSearchInput(text) {
    this.mainSearchInput.clear().type(text);
    return this;
  }
  
  /**
   * Verify map page is loaded
   */
  verifyMapPageLoaded() {
    this.verifyUrlContains('app.e2e.gcp.logineko.com/logineko/map');
    return this;
  }
  
  /**
   * Complete map page verification
   */
  verifyMapPageComplete() {
    this.verifyMapPageLoaded();
    this.verifyUserLoggedIn();
    this.verifySearchInputVisible();
    return this;
  }
}

// Export the class
export default MapPage;
