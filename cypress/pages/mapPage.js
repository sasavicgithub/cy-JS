import BasePage from './basePage.js';

class MapPage extends BasePage {
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

export default MapPage;
