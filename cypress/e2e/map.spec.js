// Import the page objects and services
import MapPage from '../pages/mapPage.js';
import WarehousePage from '../pages/warehousePage.js';
import UserService from '../Service/Helper/userService.js';

describe('Logineko Application Tests', () => {
  let mapPage;
  let warehousePage;
  let userService;

  beforeEach(() => {
    // Clear any existing authentication state
    cy.clearCookies();
    cy.clearLocalStorage();

    // Setup authenticated session for each test
    cy.setupAuthenticatedSession();

    // Initialize page objects and services
    mapPage = new MapPage();
    warehousePage = new WarehousePage();
    userService = new UserService();
  });

  describe('Map Page Tests', () => {
    it('should successfully login and display user information on map page', () => {
      // Use Page Object Model methods with error handling
      mapPage.handleUncaughtExceptions().visitMapPage().verifyMapPageComplete();
    });
  });

  describe('Warehouse Page Tests', () => {
    it('should successfully login and display user information on warehouse page', () => {
      warehousePage.handleUncaughtExceptions().visitWarehouseReceivePage();

      // Verify we're on the correct page
      cy.url().should('include', 'warehouse/receive');

      // Try to verify user is logged in (will handle missing elements gracefully)
      warehousePage.verifyUserLoggedIn();

      // Verify search input is visible
      warehousePage.verifySearchInputVisible();
    });
  });
  describe('Order Creation and Search Tests', () => {
    it('should create a new receive order via API', () => {
      userService.getAllLocations().then((locationResponse) => {
        if (locationResponse.status === 200) {
          const locations = userService.extractLocationData(locationResponse);
          const descriptions = locations.map((loc) => loc.description);
          const locationGroupNames = locations.map((loc) => loc.locationGroupName);
          cy.log('Available location descriptions:', descriptions);
          cy.log('Available location group names:', locationGroupNames);
        }
      });

      userService
        .createReceiveOrderFromHarvest('APPIUM229764', '3', 'kg', null, '000000', null, true)
        .then((response) => {
          cy.log('POST Response Status:', response.status);
          cy.log('POST Response Body:', JSON.stringify(response.body));

          if (response.status === 201 || response.status === 200) {
            // Verify the API call was successful
            userService.verifyResponseProperty(response, 'orderType', 'RECEIVE_FROM_HARVEST');
            cy.log('Created order number:', response.body.orderNumber);
            cy.log('Created order location:', response.body.locationGroupName);

            // Store the order number for use in other tests
            const orderNumber = response.body.orderNumber;
            cy.wrap(orderNumber).as('createdOrderNumber');

            // Navigate to warehouse page and verify order exists
            warehousePage.visitWarehouseReceivePage();

            // Wait for the page to fully load
            cy.url().should('include', 'warehouse/receive');
            cy.get('body').should('be.visible');

            warehousePage.verifyCreatedOrderNumber(orderNumber);
          } else {
            cy.log('Unexpected status code:', response.status);
            cy.log('Response body:', JSON.stringify(response.body));
            if (response.status === 405) {
              cy.log('⚠️ Method Not Allowed - API endpoint may not support POST requests');
            }
            expect(response.status).to.be.oneOf([200, 201, 202]);
          }
        });
    });

    it('should search for the previously created order', function () {
      // Get the order number from the previous test
      const orderNumber = this.createdOrderNumber;

      // Navigate to warehouse page
      warehousePage.visitWarehouseReceivePage();

      // Wait for the page to fully load
      cy.url().should('include', 'warehouse/receive');
      cy.wait(3000); // Give time for data to load

      // Search for the order using the search input
      warehousePage.searchCreatedOrderNumber(orderNumber);

      // Verify the order appears in the search results
      warehousePage.verifyCreatedOrderNumber(orderNumber);
      warehousePage.verifyOrderStatus('To-Do');
    });
  });
});
