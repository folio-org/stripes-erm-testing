import {
  Button,
  Checkbox,
  including,
  Pane,
  SearchField,
} from '@folio/stripes-testing';

const hideKbCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' });// Checkbox('Hide internal agreements knowledgebase');
// const hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase');
const isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();

    cy.visit('/settings/erm/general');
    cy.expect(hideKbCheckbox.exists());
    // Check if the checkbox is checked, and uncheck it if it is
    // cy.get(hideKbCheckbox).then(($checkbox) => {
    //   if ($checkbox.prop('checked')) {
    //   if ($checkbox.is({ checked: true })) {
    //     hideKbCheckbox.click();
    //   }
    // });
    // Assert that the checkbox is now unchecked
    // console.log('checkbox is unchecked test');
    // cy.expect(hideKbCheckbox.is({ checked: false }));
  });

  describe('do not hide internal agreements knowledgebase', () => {
    it('should find checkbox checked', () => {
      cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      cy.expect(hideKbCheckbox.is({ checked: true }));
    });

    it('should find checkbox unchecked', () => {
      cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      cy.expect(hideKbCheckbox.is({ checked: false }));
    });
  });
});
