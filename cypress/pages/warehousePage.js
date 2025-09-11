import BasePage from './basePage.js';

class WarehousePage extends BasePage {
  // Navigation elements
  get warehouseReceiveLink() {
    return cy.get('[href*="/warehouse/receive"]');
  }

  visitWarehouseReceivePage() {
    cy.visit(Cypress.env('appUrl') + '/warehouse/receive');
    return this;
  }

  submitReceiveForm() {
    this.receiveButton.click();
    return this;
  }
  verifyReceiveFormVisible() {
    this.receiveForm.should('be.visible');
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

  /**
   * Verify that a created order number appears in the table
   * @param {string} orderNumber - The order number to verify
   */
  verifyCreatedOrderNumber(orderNumber) {
    cy.get('.cell__text').should('contain.text', orderNumber);
    return this;
  }
  /**
   * Search for a created order number using the search input
   * @param {string} orderNumber - The order number to search for
   */
  searchCreatedOrderNumber(orderNumber) {
    // Use the search input to search for the order number
    this.searchInput.clear().type(orderNumber);
    return this;
  }

  /**
   * Verify the order status in the table
   * @param {string} expectedStatus - The expected status (e.g., "To-Do", "In Progress", "Completed")
   */
  verifyOrderStatus(expectedStatus) {
    cy.get('.cell--status > .tooltip > .tooltip__value > .cell__value').should(
      'contain.text',
      expectedStatus
    );
    return this;
  }
}

// Export the class
export default WarehousePage;
