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
      mapPage
        .handleUncaughtExceptions()
        .visitMapPage()
        .verifyMapPageComplete();
    });
  });

  describe('Warehouse Page Tests', () => {
    it('should successfully login and display user information on warehouse page', () => {
      warehousePage
        .handleUncaughtExceptions()
        .visitWarehouseReceivePage()
        
      
      // Verify we're on the correct page
      cy.url().should('include', 'warehouse/receive');
      
      // Try to verify user is logged in (will handle missing elements gracefully)
      warehousePage.verifyUserLoggedIn();
      
      // Verify search input is visible
      warehousePage.verifySearchInputVisible();
    });
  });
  describe('Search previously created order and validate it', () => {
    it('should test API endpoint and create a new receive order', () => {
      // First, let's log available locations for debugging
      userService.getAllLocations().then((locationResponse) => {
        cy.log('=== LOCATIONS API RESPONSE DEBUG ===');
        cy.log('Response status:', locationResponse.status);
        cy.log('Response body exists:', !!locationResponse.body);
        cy.log('Response body type:', typeof locationResponse.body);
        cy.log('Response body is array:', Array.isArray(locationResponse.body));
        cy.log('Response body keys:', locationResponse.body ? Object.keys(locationResponse.body) : 'No body');
        cy.log('Response body sample:', JSON.stringify(locationResponse.body, null, 2).substring(0, 1000) + '...');
        
        if (locationResponse.status === 200) {
          const locations = userService.extractLocationData(locationResponse);
          const descriptions = locations.map(loc => loc.description);
          const locationGroupNames = locations.map(loc => loc.locationGroupName);
          
          cy.log('Extracted locations count:', locations.length);
          cy.log('Available location descriptions:', descriptions);
          cy.log('Available location group names:', locationGroupNames);
          cy.log('Full extracted locations:', JSON.stringify(locations, null, 2));
        }
        cy.log('=== END LOCATIONS API RESPONSE DEBUG ===');
      });

      // Create order with dynamic next Monday date and random location
      userService.createReceiveOrderFromHarvest("APPIUM229764", "3", "kg", null, "000000", null, true).then((response) => {
        // Log response details for debugging
        cy.log('POST Response Status:', response.status);
        cy.log('POST Response Body:', JSON.stringify(response.body));
        
        if (response.status === 201 || response.status === 200) {
          // Verify the API call was successful
          userService.verifyResponseProperty(response, 'orderType', 'RECEIVE_FROM_HARVEST');
          cy.log('Created order number:', response.body.orderNumber);
          cy.log('Created order location:', response.body.locationGroupName);
          
          // Store the order number for verification
          const orderNumber = response.body.orderNumber;
          
          // Navigate to warehouse page to validate the created order
          warehousePage.visitWarehouseReceivePage();
          warehousePage.verifyCreatedOrderNumber(orderNumber); 
          warehousePage.searchCreatedOrderNumber(orderNumber);

        } else {
          cy.log('Unexpected status code:', response.status);
          expect(response.status).to.be.oneOf([200, 201, 202]);
        }
      });
    });
  });
    


});

