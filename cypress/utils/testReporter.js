// Test reporting and analytics utilities
export class TestReporter {
  static testMetrics = {
    startTime: null,
    endTime: null,
    duration: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    totalTests: 0,
    errors: [],
  };

  static startTestSuite() {
    this.testMetrics.startTime = new Date();
    cy.log('Test Suite Started:', this.testMetrics.startTime.toISOString());
  }

  static endTestSuite() {
    this.testMetrics.endTime = new Date();
    this.testMetrics.duration = this.testMetrics.endTime - this.testMetrics.startTime;

    cy.log('Test Suite Completed:', {
      duration: `${this.testMetrics.duration}ms`,
      passed: this.testMetrics.passedTests,
      failed: this.testMetrics.failedTests,
      skipped: this.testMetrics.skippedTests,
      total: this.testMetrics.totalTests,
    });
  }

  static recordTestResult(testName, status, error = null) {
    this.testMetrics.totalTests++;

    switch (status) {
      case 'passed':
        this.testMetrics.passedTests++;
        break;
      case 'failed':
        this.testMetrics.failedTests++;
        if (error) {
          this.testMetrics.errors.push({
            testName,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
        }
        break;
      case 'skipped':
        this.testMetrics.skippedTests++;
        break;
    }

    cy.log(`Test Result [${testName}]: ${status}`);
  }

  static generateReport() {
    const report = {
      summary: {
        total: this.testMetrics.totalTests,
        passed: this.testMetrics.passedTests,
        failed: this.testMetrics.failedTests,
        skipped: this.testMetrics.skippedTests,
        duration: this.testMetrics.duration,
        passRate:
          ((this.testMetrics.passedTests / this.testMetrics.totalTests) * 100).toFixed(2) + '%',
      },
      errors: this.testMetrics.errors,
      timestamp: new Date().toISOString(),
    };

    cy.writeFile('cypress/reports/test-report.json', report);
    return report;
  }
}

export class PerformanceMonitor {
  static performanceMetrics = [];

  static startTimer(testName) {
    const timer = {
      testName,
      startTime: performance.now(),
      endTime: null,
      duration: null,
    };

    this.performanceMetrics.push(timer);
    return timer;
  }

  static endTimer(testName) {
    const timer = this.performanceMetrics.find((t) => t.testName === testName && !t.endTime);
    if (timer) {
      timer.endTime = performance.now();
      timer.duration = timer.endTime - timer.startTime;

      cy.log(`Performance [${testName}]: ${timer.duration.toFixed(2)}ms`);
    }
  }

  static getPerformanceReport() {
    const avgDuration =
      this.performanceMetrics.reduce((sum, t) => sum + t.duration, 0) /
      this.performanceMetrics.length;
    const slowestTest = this.performanceMetrics.reduce((slowest, current) =>
      current.duration > slowest.duration ? current : slowest
    );

    return {
      averageDuration: avgDuration.toFixed(2) + 'ms',
      slowestTest: {
        name: slowestTest.testName,
        duration: slowestTest.duration.toFixed(2) + 'ms',
      },
      totalTests: this.performanceMetrics.length,
      metrics: this.performanceMetrics,
    };
  }
}

export class TestAnalytics {
  static analytics = {
    pageLoadTimes: [],
    apiResponseTimes: [],
    elementWaitTimes: [],
    testFlakiness: {},
  };

  static recordPageLoadTime(url, loadTime) {
    this.analytics.pageLoadTimes.push({
      url,
      loadTime,
      timestamp: new Date().toISOString(),
    });
  }

  static recordAPIResponseTime(endpoint, responseTime, statusCode) {
    this.analytics.apiResponseTimes.push({
      endpoint,
      responseTime,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  static recordElementWaitTime(selector, waitTime) {
    this.analytics.elementWaitTimes.push({
      selector,
      waitTime,
      timestamp: new Date().toISOString(),
    });
  }

  static recordTestFlakiness(testName, isFlaky) {
    if (!this.analytics.testFlakiness[testName]) {
      this.analytics.testFlakiness[testName] = { total: 0, flaky: 0 };
    }

    this.analytics.testFlakiness[testName].total++;
    if (isFlaky) {
      this.analytics.testFlakiness[testName].flaky++;
    }
  }

  static generateAnalyticsReport() {
    const report = {
      pageLoadPerformance: {
        average: this.calculateAverage(this.analytics.pageLoadTimes, 'loadTime'),
        slowest: this.findSlowest(this.analytics.pageLoadTimes, 'loadTime'),
        total: this.analytics.pageLoadTimes.length,
      },
      apiPerformance: {
        average: this.calculateAverage(this.analytics.apiResponseTimes, 'responseTime'),
        slowest: this.findSlowest(this.analytics.apiResponseTimes, 'responseTime'),
        total: this.analytics.apiResponseTimes.length,
      },
      elementWaitPerformance: {
        average: this.calculateAverage(this.analytics.elementWaitTimes, 'waitTime'),
        slowest: this.findSlowest(this.analytics.elementWaitTimes, 'waitTime'),
        total: this.analytics.elementWaitTimes.length,
      },
      testFlakiness: Object.entries(this.analytics.testFlakiness).map(([testName, data]) => ({
        testName,
        flakinessRate: ((data.flaky / data.total) * 100).toFixed(2) + '%',
        totalRuns: data.total,
        flakyRuns: data.flaky,
      })),
    };

    cy.writeFile('cypress/reports/analytics-report.json', report);
    return report;
  }

  static calculateAverage(array, property) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + item[property], 0);
    return (sum / array.length).toFixed(2) + 'ms';
  }

  static findSlowest(array, property) {
    if (array.length === 0) return null;
    return array.reduce((slowest, current) =>
      current[property] > slowest[property] ? current : slowest
    );
  }
}

export default {
  TestReporter,
  PerformanceMonitor,
  TestAnalytics,
};
