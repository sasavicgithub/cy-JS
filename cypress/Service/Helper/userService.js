class UserService {
  /**
   * Create a new receive order from harvest
   * @param {Object} orderData - The order data object
   * @param {string} orderData.orderType - Type of order (e.g., "RECEIVE_FROM_HARVEST")
   * @param {string} orderData.expectedDate - Expected date in ISO format
   * @param {Array} orderData.positions - Array of position objects
   * @param {string} orderData.partnerId - Partner ID
   * @param {string} orderData.locationGroupName - Location group name
   */
  createReceiveOrder(orderData) {
    const defaultOrderData = {
      orderType: 'RECEIVE_FROM_HARVEST',
      expectedDate: '2025-09-15T00:00:00.000Z',
      positions: [
        {
          positionId: 1,
          comment: null,
          product: {
            sku: 'APPIUM229764',
          },
          quantity: {
            value: '5',
            unit: 'kg',
          },
        },
      ],
      partnerId: '000000',
      locationGroupName: 'TPPO',
    };

    // Merge provided data with defaults
    const payload = { ...defaultOrderData, ...orderData };

    return cy.getAuthTokens().then((tokens) => {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      // Add authorization header if access token is available
      if (tokens.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return cy.request({
        method: 'POST',
        url: `${Cypress.env('baseUrl')}/api/v2/wms/receiving-orders`,
        headers: headers,
        body: payload,
        failOnStatusCode: false,
      });
    });
  }

  /**
   * Create a new receive order with custom parameters
   * @param {string} sku - Product SKU
   * @param {string} quantity - Quantity value
   * @param {string} unit - Quantity unit
   * @param {string} expectedDate - Expected date (optional)
   * @param {string} partnerId - Partner ID (optional)
   * @param {string} locationGroupName - Location group name (optional, if null will use random location)
   * @param {boolean} useRandomLocation - Whether to use a random location (default: true)
   */
  createReceiveOrderFromHarvest(
    sku = 'APPIUM229764',
    quantity = '3',
    unit = 'kg',
    expectedDate = null,
    partnerId = '000000',
    locationGroupName = null,
    useRandomLocation = true
  ) {
    // Use next Monday if no expectedDate provided
    const finalExpectedDate = expectedDate || this.getNextMonday();

    // If useRandomLocation is true and no specific location provided, get a random one
    if (useRandomLocation && !locationGroupName) {
      return this.getRandomLocation().then((randomLocation) => {
        const orderData = {
          orderType: 'RECEIVE_FROM_HARVEST',
          expectedDate: finalExpectedDate,
          positions: [
            {
              positionId: 1,
              comment: 'order',
              product: {
                sku: sku,
              },
              quantity: {
                value: quantity,
                unit: unit,
              },
            },
          ],
          partnerId: partnerId,
          locationGroupName: randomLocation.locationGroupName,
          limit: 40,
          offset: 0,
        };

        return this.createReceiveOrder(orderData);
      });
    } else {
      // Use provided location or fallback to default
      const finalLocation = locationGroupName || '1B5K';

      const orderData = {
        orderType: 'RECEIVE_FROM_HARVEST',
        expectedDate: finalExpectedDate,
        positions: [
          {
            positionId: 1,
            comment: 'order',
            product: {
              sku: sku,
            },
            quantity: {
              value: quantity,
              unit: unit,
            },
          },
        ],
        partnerId: partnerId,
        locationGroupName: finalLocation,
        limit: 40,
        offset: 0,
      };
      return this.createReceiveOrder(orderData);
    }
  }

  /**
   * Test API endpoint to see what methods are allowed
   */
  testReceivingOrdersEndpoint() {
    return cy.getAuthTokens().then((tokens) => {
      const headers = {
        Accept: 'application/json',
      };

      if (tokens.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return cy.request({
        method: 'OPTIONS',
        url: `${Cypress.env('baseUrl')}/api/v2/wms/receiving-orders`,
        headers: headers,
        failOnStatusCode: false,
      });
    });
  }

  /**
   * Get all receiving orders
   */
  getReceivingOrders() {
    return cy.getAuthTokens().then((tokens) => {
      const headers = {
        Accept: 'application/json',
      };

      if (tokens.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return cy.request({
        method: 'GET',
        url: `${Cypress.env('baseUrl')}/api/v2/wms/receiving-orders`,
        headers: headers,
        failOnStatusCode: false,
      });
    });
  }

  /**
   * Get a specific receiving order by ID
   * @param {string} orderId - The order ID
   */
  getReceivingOrderById(orderId) {
    return cy.request({
      method: 'GET',
      url: `${Cypress.env('baseUrl')}/api/v2/warehouse/receiving-orders/${orderId}`,
      headers: {
        Accept: 'application/json',
      },
      failOnStatusCode: false,
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Verify API response status
   * @param {Object} response - Cypress response object
   * @param {number} expectedStatus - Expected status code
   */
  verifyResponseStatus(response, expectedStatus = 200) {
    expect(response.status).to.equal(expectedStatus);
    return this;
  }

  /**
   * Verify API response body contains expected data
   * @param {Object} response - Cypress response object
   * @param {string} property - Property to check
   * @param {*} expectedValue - Expected value
   */
  verifyResponseProperty(response, property, expectedValue) {
    expect(response.body).to.have.property(property, expectedValue);
    return this;
  }

  /**
   * Get current date in ISO format
   * @param {number} daysOffset - Days to add/subtract from current date
   */
  getCurrentDateISO(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
  }

  /**
   * Get next Monday date in ISO format
   * @returns {string} Next Monday date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
   */
  getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days until next Monday
    let daysUntilMonday;
    if (dayOfWeek === 0) {
      // Sunday
      daysUntilMonday = 1; // Next day is Monday
    } else if (dayOfWeek === 1) {
      // Monday
      daysUntilMonday = 7; // Next Monday is in 7 days
    } else {
      // Tuesday to Saturday
      daysUntilMonday = 8 - dayOfWeek; // Days until next Monday
    }

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    // Set time to start of day (00:00:00.000Z)
    nextMonday.setUTCHours(0, 0, 0, 0);

    return nextMonday.toISOString();
  }

  /**
   * Fetch all locations from the API
   * @returns {Promise} Cypress request promise
   */
  getAllLocations() {
    return cy.getAuthTokens().then((tokens) => {
      const headers = {
        Accept: 'application/json',
      };

      // Add authorization header if access token is available
      if (tokens.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return cy.request({
        method: 'GET',
        url: `${Cypress.env('baseUrl')}/api/v2/wms/locations/hierarchy`,
        headers: headers,
        failOnStatusCode: false,
      });
    });
  }

  /**
   * Extract location data from API response
   * @param {Object} response - API response object
   * @returns {Array} Array of location objects with description and locationGroupName
   */
  extractLocationData(response) {
    const locations = [];

    // Recursive function to traverse the location hierarchy
    const traverseLocationGroups = (locationGroupList) => {
      if (Array.isArray(locationGroupList)) {
        locationGroupList.forEach((group) => {
          // Check if this group has a locationGroup object
          if (group.locationGroup) {
            const locationGroup = group.locationGroup;

            // Only include non-deleted locations that have both name and description
            if (!locationGroup.deleted && locationGroup.name && locationGroup.description) {
              locations.push({
                description: locationGroup.description,
                locationGroupName: locationGroup.name,
              });
            }
          }

          // Recursively traverse subGroups if they exist
          if (group.subGroups && Array.isArray(group.subGroups)) {
            traverseLocationGroups(group.subGroups);
          }
        });
      }
    };

    // The response body is an object with subGroups array, not a direct array
    if (response.body && response.body.subGroups && Array.isArray(response.body.subGroups)) {
      traverseLocationGroups(response.body.subGroups);
    }

    return locations;
  }

  /**
   * Extract location descriptions from API response (for backward compatibility)
   * @param {Object} response - API response object
   * @returns {Array} Array of location descriptions
   */
  extractLocationDescriptions(response) {
    const locations = this.extractLocationData(response);
    return locations.map((location) => location.description);
  }

  /**
   * Get a random location from all available locations
   * @returns {Promise} Promise that resolves to a random location object with description and locationGroupName
   */
  getRandomLocation() {
    return this.getAllLocations().then((response) => {
      if (response.status === 200) {
        const locations = this.extractLocationData(response);

        if (locations.length > 0) {
          // Get a random index
          const randomIndex = Math.floor(Math.random() * locations.length);
          const randomLocation = locations[randomIndex];

          // Return the location object directly without cy.log to avoid async/sync mixing
          return randomLocation;
        } else {
          return { description: 'Default Location', locationGroupName: '1B5K' }; // Fallback to default
        }
      } else {
        return { description: 'Default Location', locationGroupName: '1B5K' }; // Fallback to default
      }
    });
  }
}

// Export the class
export default UserService;
