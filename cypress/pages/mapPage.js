// ***********************************************
// Map Page Object Model
// Contains all locators and methods for the Map page
// ***********************************************

import BasePage from './basePage.js';

class MapPage extends BasePage {
  // ============================================
  // MAP SPECIFIC LOCATORS
  // ============================================

  // // Map specific elements
  // get mapContainer() {
  //   return cy.get('[test-map-container]');
  // }
  // get mapZoomIn() {
  //   return cy.get('[test-zoom-in]');
  // }
  // get mapZoomOut() {
  //   return cy.get('[test-zoom-out]');
  // }

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
  verifyMapPageLoaded() {
    this.verifyUrlContains('app.e2e.gcp.logineko.com/logineko/map');
    return this;
  }

  verifyMapPageComplete() {
    this.verifyMapPageLoaded();
    this.verifyUserLoggedIn();
    this.verifySearchInputVisible();
    return this;
  }
}

// Export the class
export default MapPage;
