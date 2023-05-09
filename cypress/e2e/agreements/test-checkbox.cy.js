import { Checkbox } from '@folio/stripes-testing';

const hideKbCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' });// Checkbox('Hide internal agreements knowledgebase');
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    cy.getAdminToken();
    cy.getAgreementsGeneralSettings().then((settings) => {
      console.log('settings.hideEResourcesFunctionality %o', settings.hideEResourcesFunctionality);
      if (settings.hideEResourcesFunctionality === true) {
        // remember value and set to false
        isChecked = true;
        cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: false });
        console.log('isChecked', isChecked);
      }
    });
  });

  after(() => {
    if (isChecked === true) {
      cy.getAdminToken();
      cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: true });
      cy.getAgreementsGeneralSettings();
    }
    console.log('after executed');
  });

  describe('do not hide internal agreements knowledgebase', () => {
    before(() => {
      cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
      cy.visit('/settings/erm/general');
    });

    it('should find checkbox unchecked', () => {
      cy.expect(hideKbCheckbox.exists());
      cy.expect(hideKbCheckbox.is({ checked: false }));
    });
  });
});
