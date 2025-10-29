// Test data for Cypress tests
export const testData = {
  // Order creation data
  orderCreation: {
    harvestId: 'APPIUM229764',
    quantity: '3',
    unit: 'kg',
    locationCode: '000000',
    orderType: 'RECEIVE_FROM_HARVEST',
    expectedStatus: 'To-Do',
  },

  // API endpoints
  endpoints: {
    warehouseReceive: 'warehouse/receive',
    map: 'map',
  },

  // Expected response status codes
  statusCodes: {
    success: [200, 201, 202],
    methodNotAllowed: 405,
  },

  // Test user data
  user: {
    userId: 'e2e_tester',
    organization: 'example-org',
  },

  // UI elements and text
  ui: {
    orderStatus: 'To-Do',
    searchInputVisible: true,
  },
};

export default testData;
