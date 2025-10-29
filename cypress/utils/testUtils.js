// Utility functions for common operations
export class TestUtils {
  /**
   * Generate random test data
   */
  static generateRandomString(length = 8) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  static generateRandomEmail() {
    return `test-${this.generateRandomString()}@logineko.com`;
  }

  static generateRandomNumber(min = 1, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Date utilities
   */
  static getCurrentDate(format = 'ISO') {
    const date = new Date();
    switch (format) {
      case 'ISO':
        return date.toISOString();
      case 'YYYY-MM-DD':
        return date.toISOString().split('T')[0];
      case 'timestamp':
        return date.getTime();
      default:
        return date.toISOString();
    }
  }

  static getFutureDate(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  /**
   * String utilities
   */
  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Array utilities
   */
  static getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Object utilities
   */
  static deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  static removeEmptyValues(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
  }

  /**
   * Validation utilities
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait utilities
   */
  static async waitForCondition(condition, timeout = 5000, interval = 100) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Error handling utilities
   */
  static handleTestError(error, context = '') {
    const errorInfo = {
      message: error.message,
      context,
      timestamp: this.getCurrentDate(),
      stack: error.stack,
    };

    cy.log('Test Error:', JSON.stringify(errorInfo, null, 2));
    throw error;
  }

  /**
   * Performance utilities
   */
  static measurePerformance(name, fn) {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    cy.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
    return { result, duration };
  }
}

export default TestUtils;
