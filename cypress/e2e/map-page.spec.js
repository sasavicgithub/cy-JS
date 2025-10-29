import MapPage from '../pages/mapPage.js';

describe('Map Page Tests', () => {
  let mapPage;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthenticatedSession();
    mapPage = new MapPage();
  });

  it('should successfully login and display user information on map page', () => {
    // Arrange
    mapPage.handleUncaughtExceptions();

    // Act
    mapPage.visitMapPage();

    // Assert
    mapPage.verifyMapPageComplete();
  });
});
