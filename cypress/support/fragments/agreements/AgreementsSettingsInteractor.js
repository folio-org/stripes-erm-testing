import {
  Checkbox,
} from '@folio/stripes-testing';


/* The cypressinteractor for the Agreement Settings page
 *
 * If we find ourselves doing a certain action on Agreement Settings a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementsSettingsInteractor {
  static hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase');
  static hideEresourcesFunctionalityCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' })

  static navigateToAgreementsSettings() {
    cy.visit('/settings/erm/general');
  }

  static ensureHideAgreementsKBUnchecked() {
    this.navigateToAgreementsSettings();
    cy.expect(this.hideKbCheckbox.exists());
    cy.expect(this.hideKbCheckbox.is({ checked: false }));
  }
}

