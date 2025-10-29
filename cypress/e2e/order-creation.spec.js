import WarehousePage from '../pages/warehousePage.js';
import UserService from '../Service/Helper/userService.js';
import { testData } from '../fixtures/testData.js';

describe('Order Creation Tests', () => {
  let warehousePage;
  let userService;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthenticatedSession();
    warehousePage = new WarehousePage();
    userService = new UserService();
  });

  it('should create a new receive order via API', () => {
    // Arrange
    userService.getAllLocations().then((locationResponse) => {
      if (locationResponse.status === 200) {
        const locations = userService.extractLocationData(locationResponse);
        const descriptions = locations.map((loc) => loc.description);
        const locationGroupNames = locations.map((loc) => loc.locationGroupName);
        cy.log('Available location descriptions:', descriptions);
        cy.log('Available location group names:', locationGroupNames);
      }
    });

    // Act
    userService
      .createReceiveOrderFromHarvest(
        testData.orderCreation.harvestId,
        testData.orderCreation.quantity,
        testData.orderCreation.unit,
        null,
        testData.orderCreation.locationCode,
        null,
        true
      )
      .then((response) => {
        cy.log('POST Response Status:', response.status);
        cy.log('POST Response Body:', JSON.stringify(response.body));

        // Assert
        if (testData.statusCodes.success.includes(response.status)) {
          userService.verifyResponseProperty(
            response,
            'orderType',
            testData.orderCreation.orderType
          );
          cy.log('Created order number:', response.body.orderNumber);
          cy.log('Created order location:', response.body.locationGroupName);

          const orderNumber = response.body.orderNumber;
          cy.wrap(orderNumber).as('createdOrderNumber');

          cy.log('Navigating to warehouse page to verify order:', orderNumber);
          warehousePage.handleUncaughtExceptions().visitWarehouseReceivePage();

          cy.url().should('include', testData.endpoints.warehouseReceive);
          cy.get('body').should('be.visible');
          cy.log('Successfully navigated to warehouse page');

          warehousePage.verifyCreatedOrderNumber(orderNumber);
        } else {
          cy.log('Unexpected status code:', response.status);
          cy.log('Response body:', JSON.stringify(response.body));
          if (response.status === testData.statusCodes.methodNotAllowed) {
            cy.log('⚠️ Method Not Allowed - API endpoint may not support POST requests');
          }
          expect(response.status).to.be.oneOf(testData.statusCodes.success);
        }
      });
  });
});
