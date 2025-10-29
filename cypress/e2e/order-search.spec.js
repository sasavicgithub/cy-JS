import WarehousePage from '../pages/warehousePage.js';
import { testData } from '../fixtures/testData.js';

describe('Order Search Tests', () => {
  let warehousePage;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthenticatedSession();
    warehousePage = new WarehousePage();
  });

  it('should search for the previously created order', function () {
    // Arrange
    const orderNumber = this.createdOrderNumber;
    cy.log('Searching for order number:', orderNumber);
    warehousePage.handleUncaughtExceptions();

    // Act
    warehousePage.visitWarehouseReceivePage();
    warehousePage.searchCreatedOrderNumber(orderNumber);

    // Assert
    cy.url().should('include', testData.endpoints.warehouseReceive);
    cy.get('body').should('be.visible');
    warehousePage.verifyCreatedOrderNumber(orderNumber);
    warehousePage.verifyOrderStatus(testData.ui.orderStatus);
  });
});
