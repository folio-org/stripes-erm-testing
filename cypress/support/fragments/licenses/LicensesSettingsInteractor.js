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


  /* FIXME I'm not sure I like that these are entirely label based.
   * On the one hand, the component is filled in label first.
   * On the other hand, refdata labels are changeable and values are static
   * One potential solution is to make decisions based on values (potentially on
   * test side) and then creating label first, and deleting based
   * on value not label. This likely requires the centralised refdata values
   * mentioned in other issues, so we can combine expected value/label pairs
   * and do work based on those.
   *
   * For integration tests though maybe that is not ideal and we should instead
   * just use labels -- with appropriate checks for pre-existing values to satisfy
   * failure cases.
   *
   * ie create refdata "Active" -- first check that there is no normalised value "active"
   * If there IS then either change the label back instead (How do we return to normal
   * after?) or create new refdata with "Active1", then change label to "Active" so
   * tests can pass (difficult again to track after the fact)
   * Potentially call "ensureRefdata" and have it return a cleanup method to run afterwards?
   */
  static createLicensesRefdataValue(refdataDesc, refdataLabel) {
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

