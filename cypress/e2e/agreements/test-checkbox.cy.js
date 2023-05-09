import {
  Button,
  Checkbox,
  including,
  Pane,
  SearchField,
} from '@folio/stripes-testing';

const hideKbCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' });// Checkbox('Hide internal agreements knowledgebase');
const saveButton = Button('Save');
// const hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase');
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();

    cy.visit('/settings/erm/general');
    cy.expect(hideKbCheckbox.exists());
    // Check if the checkbox is checked, and uncheck it if it is
    cy.get('input[type="checkbox"][name="hideEResourcesFunctionality"]').then(($checkbox) => {
      // console.log('$checkbox %o', $checkbox);
      // console.log('$checkbox[0]:', $checkbox[0]);
      console.log('$checkbox:', $checkbox);
      console.log('checked:', $checkbox.prop('checked'));
      console.log('value:', $checkbox.attr('value'));
      console.log('$checkbox.is(:checked)', $checkbox.is(':checked'));
      if ($checkbox.is(':checked')) {
        // if ($checkbox.prop('checked')) {
        isChecked = true;
        console.log('isChecked %o', isChecked);
        $checkbox.click();
        console.log('saveButton');
        cy.expect(saveButton.is({ visible: true }));
        cy.do(saveButton.click());
      }
    });

    // if (isChecked === true) {
    //   // cy.expect(saveButton.exists());
    //   console.log('saveButton');
    //   cy.expect(saveButton.is({ visible: true }));
    //   cy.do(saveButton.click());
    // }
  });
  // Assert that the checkbox is now unchecked
  // console.log('checkbox is unchecked test');
  // cy.expect(hideKbCheckbox.is({ checked: false }));

  describe('do not hide internal agreements knowledgebase', () => {
    it('should find checkbox checked', () => {
      // cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      cy.expect(hideKbCheckbox.is({ checked: true }));
    });

    it('should find checkbox unchecked', () => {
      // cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      cy.expect(hideKbCheckbox.is({ checked: false }));
    });
  });
});
