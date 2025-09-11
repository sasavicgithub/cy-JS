// ***********************************************
// Warehouse Page Object Model
// Contains all locators and methods for the Warehouse page
// ***********************************************

import BasePage from './basePage.js';

class WarehousePage extends BasePage {
  // ============================================
  // WAREHOUSE SPECIFIC LOCATORS
  // ============================================

  // Navigation elements
  get warehouseReceiveLink() {
    return cy.get('[href*="/warehouse/receive"]');
  }
  get warehouseShipLink() {
    return cy.get('[href*="/warehouse/ship"]');
  }
  get warehouseInventoryLink() {
    return cy.get('[href*="/warehouse/inventory"]');
  }

  // Warehouse Receive page specific elements
  get receivePageTitle() {
    return cy.get('[test-receive-page-title]');
  }
  get receiveForm() {
    return cy.get('[test-receive-form]');
  }
  get receiveButton() {
    return cy.get('[test-receive-button]');
  }
  get receiveTable() {
    return cy.get('[test-receive-table]');
  }

  // Warehouse Inventory page specific elements
  get inventoryPageTitle() {
    return cy.get('[test-inventory-page-title]');
  }
  get inventoryTable() {
    return cy.get('[test-inventory-table]');
  }
  get inventoryFilter() {
    return cy.get('[test-inventory-filter]');
  }
  get inventorySearch() {
    return cy.get('[test-inventory-search]');
  }

  // Common warehouse elements
  get warehouseMenu() {
    return cy.get('[test-warehouse-menu]');
  }
  get warehouseSubmenu() {
    return cy.get('[test-warehouse-submenu]');
  }
  get warehouseBreadcrumb() {
    return cy.get('[test-warehouse-breadcrumb]');
  }

  // Form elements
  get productInput() {
    return cy.get('[test-product-input]');
  }
  get quantityInput() {
    return cy.get('[test-quantity-input]');
  }
  get batchInput() {
    return cy.get('[test-batch-input]');
  }
  get dateInput() {
    return cy.get('[test-date-input]');
  }
  get supplierInput() {
    return cy.get('[test-supplier-input]');
  }

  // Action buttons
  get saveButton() {
    return cy.get('[test-save-button]');
  }
  get cancelButton() {
    return cy.get('[test-cancel-button]');
  }
  get deleteButton() {
    return cy.get('[test-delete-button]');
  }
  get editButton() {
    return cy.get('[test-edit-button]');
  }
  get addButton() {
    return cy.get('[test-add-button]');
  }

  // Table elements
  get tableRows() {
    return cy.get('[test-table-rows]');
  }
  get tableHeaders() {
    return cy.get('[test-table-headers]');
  }
  get tablePagination() {
    return cy.get('[test-table-pagination]');
  }

  // ============================================
  // METHODS
  // ============================================

  /**
   * Visit the warehouse page
   */
  visitWarehousePage() {
    cy.visit(Cypress.env('appUrl') + '/warehouse');
    return this;
  }

  /**
   * Visit the warehouse receive page
   */
  visitWarehouseReceivePage() {
    cy.visit(Cypress.env('appUrl') + '/warehouse/receive');
    return this;
  }

  /**
   * Submit receive form
   */
  submitReceiveForm() {
    this.receiveButton.click();
    return this;
  }

  /**
   * Verify receive form is visible
   */
  verifyReceiveFormVisible() {
    this.receiveForm.should('be.visible');
    return this;
  }

  verifyReceiveTableVisible() {
    this.receiveTable.should('be.visible');
    return this;
  }

  searchInventory(searchTerm) {
    this.inventorySearch.clear().type(searchTerm);
    return this;
  }

  filterInventory(filterValue) {
    this.inventoryFilter.select(filterValue);
    return this;
  }

  verifyInventoryTableVisible() {
    this.inventoryTable.should('be.visible');
    return this;
  }

  /**
   * Verify inventory page title
   */
  verifyInventoryPageTitle(expectedTitle = 'Inventory') {
    this.inventoryPageTitle.should('be.visible').and('contain.text', expectedTitle);
    return this;
  }

  // ============================================
  // COMMON WAREHOUSE METHODS
  // ============================================

  /**
   * Verify warehouse menu is visible
   */
  verifyWarehouseMenuVisible() {
    this.warehouseMenu.should('be.visible');
    return this;
  }

  /**
   * Verify warehouse breadcrumb is visible
   */
  verifyWarehouseBreadcrumbVisible() {
    this.warehouseBreadcrumb.should('be.visible');
    return this;
  }

  /**
   * Click add button
   */
  clickAddButton() {
    this.addButton.click();
    return this;
  }

  /**
   * Click edit button
   */
  clickEditButton() {
    this.editButton.click();
    return this;
  }

  /**
   * Click delete button
   */
  clickDeleteButton() {
    this.deleteButton.click();
    return this;
  }

  /**
   * Click save button
   */
  clickSaveButton() {
    this.saveButton.click();
    return this;
  }

  /**
   * Click cancel button
   */
  clickCancelButton() {
    this.cancelButton.click();
    return this;
  }

  /**
   * Verify table has rows
   */
  verifyTableHasRows(expectedCount = 1) {
    this.tableRows.should('have.length.at.least', expectedCount);
    return this;
  }

  /**
   * Verify table headers are visible
   */
  verifyTableHeadersVisible() {
    this.tableHeaders.should('be.visible');
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
