import WarehousePage from '../pages/warehousePage.js';
import { testData } from '../fixtures/testData.js';

describe('Warehouse Page Tests', () => {
  let warehousePage;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthenticatedSession();
    warehousePage = new WarehousePage();
  });

  it('should successfully login and display user information on warehouse page', () => {
    // Arrange
    warehousePage.handleUncaughtExceptions();

    // Act
    warehousePage.visitWarehouseReceivePage();

    // Assert
    cy.url().should('include', testData.endpoints.warehouseReceive);
    warehousePage.verifyUserLoggedIn();
    warehousePage.verifySearchInputVisible();
  });
});
