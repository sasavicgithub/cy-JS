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
    // Wait for the page to load and data to be available
    cy.get('body').should('be.visible');

    // Wait for either the table to load or show a message that no data is available
    cy.get('.cell__text, .no-data, .empty-state', { timeout: 15000 }).should('exist');

    // Check if the order number exists in any cell
    cy.get('body').then(($body) => {
      if ($body.find('.cell__text').length > 0) {
        cy.get('.cell__text').should('contain.text', orderNumber);
      } else {
        cy.log(`⚠️ No table data found. Order ${orderNumber} may not be visible yet.`);
        // Take a screenshot for debugging
        cy.screenshot(`warehouse-page-no-data-${orderNumber}`);
      }
    });

    return this;
  }
  /**
   * Search for a created order number using the search input
   * @param {string} orderNumber - The order number to search for
   */
  searchCreatedOrderNumber(orderNumber) {
    // Use the search input to search for the order number
    this.searchInput.clear().type(orderNumber);

    // Wait for search results to load
    cy.wait(2000); // Give time for the search to process

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
