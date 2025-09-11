import BasePage from './basePage.js';

class WarehousePage extends BasePage {
  get warehouseReceiveLink() {
    return cy.get('[href*="/warehouse/receive"]');
  }

  visitWarehouseReceivePage() {
    cy.visit(Cypress.env('appUrl') + '/warehouse/receive');
    cy.url().should('include', 'warehouse/receive');
    cy.get('body').should('be.visible');
    cy.get('.loading, .spinner, [data-testid*="loading"]', { timeout: 10000 }).should('not.exist');
    this.waitForTableToLoad();
    return this;
  }

  waitForTableToLoad() {
    cy.get('.table', { timeout: 15000 }).should('be.visible');
    cy.get('.table__body', { timeout: 10000 }).should('be.visible');
    cy.get('.table__row', { timeout: 15000 }).should('exist');
    cy.wait(1000);
    return this;
  }

  // submitReceiveForm() {
  //   this.receiveButton.click();
  //   return this;
  // }

  // verifyReceiveFormVisible() {
  //   this.receiveForm.should('be.visible');
  //   return this;
  // }

  searchInventory(searchTerm) {
    this.inventorySearch.clear().type(searchTerm);
    return this;
  }

  verifyInventoryTableVisible() {
    this.inventoryTable.should('be.visible');
    return this;
  }

  verifyCreatedOrderNumber(orderNumber) {
    cy.get('.table', { timeout: 15000 }).should('be.visible');
    cy.get('.table__body', { timeout: 10000 }).should('be.visible');
    cy.get('.table__row', { timeout: 15000 }).should('exist');
    cy.get('.table__row .cell__text').should('be.visible').and('contain.text', orderNumber);
    return this;
  }

  searchCreatedOrderNumber(orderNumber) {
    this.searchInput.clear().type(orderNumber);
    cy.wait(2000);
    return this;
  }

  verifyOrderStatus(expectedStatus) {
    cy.get('.table', { timeout: 15000 }).should('be.visible');
    cy.get('.table__body', { timeout: 10000 }).should('be.visible');
    cy.get('.table__row', { timeout: 15000 }).should('exist');
    cy.get('.table__row .cell--status .cell__text')
      .should('be.visible')
      .and('contain.text', expectedStatus);
    return this;
  }
}

export default WarehousePage;
