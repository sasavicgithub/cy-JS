import MapPage from '../pages/mapPage.js';
import WarehousePage from '../pages/warehousePage.js';
import UserService from '../Service/Helper/userService.js';

describe('Logineko Application Tests', () => {
  let mapPage;
  let warehousePage;
  let userService;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthenticatedSession();
    mapPage = new MapPage();
    warehousePage = new WarehousePage();
    userService = new UserService();
  });

  describe('Map Page Tests', () => {
    it('should successfully login and display user information on map page', () => {
      mapPage.handleUncaughtExceptions().visitMapPage().verifyMapPageComplete();
    });
  });

  describe('Warehouse Page Tests', () => {
    it('should successfully login and display user information on warehouse page', () => {
      warehousePage.handleUncaughtExceptions().visitWarehouseReceivePage();
      cy.url().should('include', 'warehouse/receive');
      warehousePage.verifyUserLoggedIn();
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
            userService.verifyResponseProperty(response, 'orderType', 'RECEIVE_FROM_HARVEST');
            cy.log('Created order number:', response.body.orderNumber);
            cy.log('Created order location:', response.body.locationGroupName);

            const orderNumber = response.body.orderNumber;
            cy.wrap(orderNumber).as('createdOrderNumber');

            cy.log('Navigating to warehouse page to verify order:', orderNumber);
            warehousePage.handleUncaughtExceptions().visitWarehouseReceivePage();

            cy.url().should('include', 'warehouse/receive');
            cy.get('body').should('be.visible');
            cy.log('Successfully navigated to warehouse page');

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
      const orderNumber = this.createdOrderNumber;
      cy.log('Searching for order number:', orderNumber);

      warehousePage.handleUncaughtExceptions().visitWarehouseReceivePage();

      cy.url().should('include', 'warehouse/receive');
      cy.get('body').should('be.visible');

      warehousePage.searchCreatedOrderNumber(orderNumber);

      warehousePage.verifyCreatedOrderNumber(orderNumber);
      warehousePage.verifyOrderStatus('To-Do');
    });
  });
});
