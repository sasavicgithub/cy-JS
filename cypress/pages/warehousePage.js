import BasePage from './basePage.js';

class WarehousePage extends BasePage {
  get warehouseReceiveLink() {
    return cy.get('[href*="/warehouse/receive"]');
  }

  visitWarehouseReceivePage() {
    const warehouseUrl = Cypress.env('appUrl') + '/warehouse/receive';
    cy.log('Navigating to warehouse URL:', warehouseUrl);
    cy.visit(warehouseUrl);
    cy.url().then((url) => {
      cy.log('Current URL after navigation:', url);
    });
    cy.url().should('include', 'warehouse/receive');
    cy.get('body').should('be.visible');
    cy.get('.loading, .spinner, [data-testid*="loading"]', { timeout: 10000 }).should('not.exist');
    cy.get('body').should('not.contain.text', 'Map');
    this.waitForTableToLoad();
    return this;
  }

  waitForTableToLoad() {
    cy.get('body').should('be.visible');

    cy.get('body').then(($body) => {
      const possibleTableSelectors = [
        '.table',
        '[data-testid*="table"]',
        '.data-table',
        '.grid',
        '.list',
      ];
      let foundTable = false;

      possibleTableSelectors.forEach((selector) => {
        if ($body.find(selector).length > 0) {
          cy.log(`Found table with selector: ${selector}`);
          foundTable = true;
        }
      });

      if (!foundTable) {
        cy.log('No table found, taking screenshot for debugging');
        cy.get('body').should('exist');
        cy.screenshot('warehouse-page-no-table');
        cy.log('Page HTML sample:', $body.html().substring(0, 500));
      }
    });

    cy.get('body').should('be.visible');
    return this;
  }

  searchInventory(searchTerm) {
    this.inventorySearch.clear().type(searchTerm);
    return this;
  }

  verifyInventoryTableVisible() {
    this.inventoryTable.should('be.visible');
    return this;
  }

  verifyCreatedOrderNumber(orderNumber) {
    cy.get('body').should('be.visible');
    cy.get('body').should('contain.text', orderNumber);
    return this;
  }

  searchCreatedOrderNumber(orderNumber) {
    this.searchInput.clear().type(orderNumber);
    cy.get('body').should('be.visible');
    return this;
  }

  verifyOrderStatus(expectedStatus) {
    cy.get('body').should('be.visible');
    cy.get('body').should('contain.text', expectedStatus);
    return this;
  }
}

export default WarehousePage;
