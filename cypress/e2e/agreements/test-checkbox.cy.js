import {
  Button,
  Checkbox,
  including,
  Pane,
  SearchField,
} from '@folio/stripes-testing';

const hideKbCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' });// Checkbox('Hide internal agreements knowledgebase');
// const hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase');
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
    //   cy.visit('/settings/erm/general');
    //   cy.get('#hideEResourcesFunctionality').then(($checkbox) => {
    //     isChecked = $checkbox.is(':checked'); // store checkbox state
    //     if (isChecked) {
    //       cy.wrap($checkbox).uncheck(); // uncheck the checkbox
    //     }
    //   });
    //   cy.logout();
  });

  // function verifyCheckboxIsChecked(checkBoxId, alias) {
  //   cy.get(checkBoxId)
  //     .as(alias)
  //     .invoke('is', ':checked')
  //     .then((initial) => {
  //       if (!initial) {
  //         cy.get('@checkbox').uncheck();
  //       } else {
  //         cy.get('@checkbox').check();
  //       }
  //     });
  // }

  describe('do not hide internal agreements knowledgebase', () => {
    it('should uncheck checkbox if it is checked', () => {
      cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      // cy.get(hideKbCheckbox)
      // cy.get('#hideEResourcesFunctionality')

      // .should('exist')
      // .then(($checkbox) => {
      //   // Store the initial status of the checkbox
      //   const isChecked = $checkbox.prop('checked');
      //   console.log('isChecked', isChecked);
      //   // Assert that the checkbox is checked
      //   if (isChecked) {
      //     cy.wrap($checkbox).should('be.checked');

      //     // Uncheck the checkbox
      //     // eslint-disable-next-line cypress/no-force
      //     cy.wrap($checkbox).click({ force: true });
      //     cy.wrap($checkbox).should('not.be.checked');
      //   } else {
      //     // Assert that the checkbox is not checked
      //     cy.wrap($checkbox).should('not.be.checked');

      //     // Check the checkbox
      //     // eslint-disable-next-line cypress/no-force
      //     cy.wrap($checkbox).click({ force: true });
      //     cy.wrap($checkbox).should('be.checked');
      //   }

      // Reset the checkbox to the initial status
      // if (isChecked) {
      //   // eslint-disable-next-line cypress/no-force
      //   cy.wrap($checkbox).click({ force: true });
      //   cy.wrap($checkbox).should('be.checked');
      // } else {
      //   cy.wrap($checkbox).should('not.be.checked');
      // }
      // });


      // cy.get('#hideEResourcesFunctionality')
      // cy.get('[id=hideEResourcesFunctionality]')
      //   .should('be.visible')
      //   .then(($checkbox) => {
      //     // Store the initial status of the checkbox
      //     const isChecked = $checkbox.prop('checked');

      //     // Assert that the checkbox is checked
      //     if (isChecked) {
      //       cy.wrap($checkbox).should('be.checked');

      //       // Uncheck the checkbox
      //       cy.wrap($checkbox).click();
      //       cy.wrap($checkbox).should('not.be.checked');
      //     } else {
      //       // Assert that the checkbox is not checked
      //       cy.wrap($checkbox).should('not.be.checked');

      //       // Check the checkbox
      //       cy.wrap($checkbox).click();
      //       cy.wrap($checkbox).should('be.checked');
      //     }

      // Reset the checkbox to the initial status
      // if (isChecked) {
      //   cy.wrap($checkbox).click();
      //   cy.wrap($checkbox).should('be.checked');
      // } else {
      //   cy.wrap($checkbox).should('not.be.checked');
      // }
      // });


      // verifyCheckboxIsChecked('#hideEResourcesFunctionality', 'checkbox');
      //
      // cy.get(hideKbCheckbox)
      //   .invoke('is', ':checked')
      //   .then((initial) => {
      //     if (!initial) {
      //       cy.get('@checkbox').uncheck();
      //     } else {
      //       cy.get('@checkbox').check();
      //     }
      //   });
      // cy.get(hideKbCheckbox);
      // cy.do(hideKbCheckbox.uncheck());
      // cy.do(Button('Save').click());
      // cy.get('#paneHeaderpane-agreements-settings-general').within(() => {
      console.log('hideKbCheckbox', hideKbCheckbox);
      cy.get(hideKbCheckbox).then(() => {
        isChecked = hideKbCheckbox.has({ checked: true }); // store checkbox state
        console.log('isChecked %o', isChecked);
        // if (isChecked) {
        //   // cy.wrap($checkbox).click(); // uncheck the checkbox
        //   cy.do($checkbox.click());
        //   // cy.expect(Button('Save').exists());
        //   // Button('Save').click();
        //   cy.get('#clickable-save-agreements-general-settings').click(); // click the submit button
        // }
      });
      // });
      // cy.logout();
    });
  });
});
