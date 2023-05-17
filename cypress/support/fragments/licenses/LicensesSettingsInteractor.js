import {
  Button,
  Modal,
  Select,
} from '@folio/stripes-testing';

/* The cypressinteractor for the License Settings page
 *
 * If we find ourselves doing a certain action on License Settings a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class LicensesSettingsInteractor {
  static deleteButton = Button('Delete');
  static deleteValueModal = Modal('Delete pick list value');
  static inputSelector = 'input[name="contentData[0].label"]';
  static newButton = Button('New');
  static pickListSelect = Select('Pick list');
  static saveButton = Button('Save');

  static navigateToPickListValuesSettings() {
    cy.visit('/settings/licenses/pick-list-values');
  }

  static selectPickList(refdataDesc) {
    cy.do(this.pickListSelect.choose(refdataDesc));
  }

  static setLicensesRefdataValue(refdataDesc, refdataLabel) {
    this.navigateToPickListValuesSettings();
    this.selectPickList(refdataDesc);
    cy.expect(this.newButton.exists());
    cy.do(this.newButton.click());
    cy.get(this.inputSelector).should('exist').type(refdataLabel);
    cy.expect(this.saveButton.exists());
    cy.do(this.saveButton.click());
    cy.contains('div', refdataLabel).should('exist');
  }

  static deleteLicensesRefdataValue(refdataDesc, refdataLabel) {
    this.navigateToPickListValuesSettings();
    this.selectPickList(refdataDesc);
    cy.contains('div', refdataLabel).should('exist');
    cy.get(`button[aria-label="Delete value ${refdataLabel}"]`)
      .should('exist')
      .click();
    cy.expect(this.deleteValueModal.exists());
    cy.do(this.deleteButton.click());
  }
}

