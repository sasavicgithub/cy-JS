// Test data factories for creating dynamic test data
import { testData } from '../fixtures/testData.js';

export class OrderDataFactory {
  static createReceiveOrder(overrides = {}) {
    const baseOrder = {
      harvestId: testData.orderCreation.harvestId,
      quantity: testData.orderCreation.quantity,
      unit: testData.orderCreation.unit,
      locationCode: testData.orderCreation.locationCode,
      orderType: testData.orderCreation.orderType,
      timestamp: new Date().toISOString(),
      ...overrides,
    };

    return baseOrder;
  }

  static createRandomOrder() {
    const randomId = Math.random().toString(36).substring(7).toUpperCase();
    return this.createReceiveOrder({
      harvestId: `RANDOM${randomId}`,
      quantity: (Math.random() * 10 + 1).toFixed(2),
    });
  }

  static createOrderWithCustomLocation(locationCode) {
    return this.createReceiveOrder({
      locationCode: locationCode || 'CUSTOM001',
    });
  }
}

export class UserDataFactory {
  static createTestUser(overrides = {}) {
    return {
      userId: testData.user.userId,
      organization: testData.user.organization,
      permissions: ['read', 'write'],
      ...overrides,
    };
  }

  static createAdminUser() {
    return this.createTestUser({
      userId: 'admin_user',
      permissions: ['read', 'write', 'admin', 'delete'],
    });
  }
}

export class APIDataFactory {
  static createSuccessResponse(data = {}) {
    return {
      status: 200,
      statusText: 'OK',
      body: {
        success: true,
        timestamp: new Date().toISOString(),
        ...data,
      },
    };
  }

  static createErrorResponse(status = 400, message = 'Bad Request') {
    return {
      status,
      statusText: 'Error',
      body: {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export default {
  OrderDataFactory,
  UserDataFactory,
  APIDataFactory,
};
