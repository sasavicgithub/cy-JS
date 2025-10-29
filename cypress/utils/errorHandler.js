// Error handling and retry mechanisms
export class ErrorHandler {
  static retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'Element not found',
    'Network error',
    'Timeout',
  ];

  static async retryOperation(operation, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      exponentialBackoff = true,
      retryCondition = null,
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        const isRetryable = retryCondition ? retryCondition(error) : this.isRetryableError(error);

        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const currentDelay = exponentialBackoff ? delay * Math.pow(2, attempt - 1) : delay;

        cy.log(`Attempt ${attempt} failed, retrying in ${currentDelay}ms...`);
        await this.sleep(currentDelay);
      }
    }

    throw lastError;
  }

  static isRetryableError(error) {
    const errorMessage = error.message || error.toString();
    return this.retryableErrors.some((retryableError) => errorMessage.includes(retryableError));
  }

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static handleElementNotFound(selector, context = '') {
    cy.log(`Element not found: ${selector} in context: ${context}`);
    cy.takeNamedScreenshot(`element-not-found-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`);
  }

  static handleAPIFailure(endpoint, statusCode, context = '') {
    cy.log(`API Failure: ${endpoint} returned ${statusCode} in context: ${context}`);
    cy.takeNamedScreenshot(`api-failure-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`);
  }
}

export class TestRetryManager {
  static retryConfig = {
    elementWait: { maxRetries: 3, delay: 1000 },
    apiCall: { maxRetries: 2, delay: 2000 },
    navigation: { maxRetries: 2, delay: 1500 },
  };

  static async retryElementOperation(operation, config = {}) {
    const finalConfig = { ...this.retryConfig.elementWait, ...config };
    return ErrorHandler.retryOperation(operation, finalConfig);
  }

  static async retryAPICall(operation, config = {}) {
    const finalConfig = { ...this.retryConfig.apiCall, ...config };
    return ErrorHandler.retryOperation(operation, finalConfig);
  }

  static async retryNavigation(operation, config = {}) {
    const finalConfig = { ...this.retryConfig.navigation, ...config };
    return ErrorHandler.retryOperation(operation, finalConfig);
  }
}

export default {
  ErrorHandler,
  TestRetryManager,
};
