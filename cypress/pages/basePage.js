class BasePage {
  get loggedInUser() {
    return cy.get('[test-logged-in-user]');
  }
  get userAcronym() {
    return cy.get('[test-user-acronym]');
  }
  get userLabel() {
    return cy.get('[test-logged-in-user] .link__label');
  }

  // Search elements
  get searchInput() {
    return cy.get('input[placeholder="Search"]');
  }
  get mainSearchInput() {
    return cy.get('[test-main-search-input]');
  }

  // Navigation elements
  get mapLink() {
    return cy.get('[href*="/logineko/map"]');
  }

  verifyUserLoggedIn(expectedName = 'E2e Tester') {
    cy.url().should('not.include', 'auth.e2e.gcp.logineko.com');
    this.userLabel.scrollIntoView().should('be.visible').and('contain.text', expectedName);
    return this;
  }

  verifyUserAcronym(expectedAcronym = 'ET') {
    this.userAcronym.should('be.visible').and('have.text', expectedAcronym);
    return this;
  }

  verifySearchInputVisible() {
    this.searchInput.should('be.visible');
    return this;
  }

  typeInSearchInput(text) {
    this.searchInput.clear().type(text);
    return this;
  }

  typeInMainSearchInput(text) {
    this.mainSearchInput.clear().type(text);
    return this;
  }

  verifyUrlContains(expectedPath) {
    cy.url().should('include', expectedPath);
    return this;
  }

  navigateToMap() {
    this.mapLink.click();
    return this;
  }

  handleUncaughtExceptions() {
    cy.on('uncaught:exception', (err) => {
      // Ignore postMessage errors from Keycloak iframe
      if (err.message.includes('postMessage')) {
        return false;
      }
      return true;
    });
    return this;
  }
}

// Export the class
export default BasePage;
