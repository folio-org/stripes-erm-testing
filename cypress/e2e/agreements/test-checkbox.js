import {
  Button,
  Checkbox,
  including,
  Pane,
  SearchField,
} from '@folio/stripes-testing';

import { AppListInteractor as AppList } from '../../../interactors';

import { getRandomPostfix } from '../../support/utils/stringTools';

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest'
};

const viewPermissions = ['ui-agreements.agreements.view', 'ui-agreements.resources.view'];
// const viewPermissions = ['Agreements: Search & view agreements', 'Agreements: Search & view e-resources'];

const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest'
};

const editPermissions = ['ui-agreements.agreements.edit', 'ui-agreements.resources.edit', 'ui-local-kb-admin.jobs.edit'];

const hideKbCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' });// Checkbox('Hide internal agreements knowledgebase');
const isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    // create test users
    console.log('createUser');
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);
    cy.createUserWithPwAndPerms(editUser, editPermissions);

    // do not hide internal agreements knowledgebase
    // console.log('settings');
    // cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    // cy.getAdminToken();
    // cy.visit('/settings/erm/general');
    // cy.get('#hideEResourcesFunctionality').uncheck();
    // cy.get('#hideEResourcesFunctionality').then(($checkbox) => {
    //   isChecked = $checkbox.is(':checked'); // store checkbox state
    //   console.log('isChecked %o', isChecked);
    //   if (isChecked) {
    //     cy.wrap($checkbox).uncheck(); // uncheck the checkbox
    //   }
    // });
    // cy.logout();
  });

  // before('do not hide internal agreements knowledgebase', () => {
  //   cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
  //   cy.getAdminToken();
  //   cy.visit('/settings/erm/general');
  //   cy.get('#hideEResourcesFunctionality').then(($checkbox) => {
  //     isChecked = $checkbox.is(':checked'); // store checkbox state
  //     if (isChecked) {
  //       cy.wrap($checkbox).uncheck(); // uncheck the checkbox
  //     }
  //   });
  //   cy.logout();
  // });

  after(() => {
    // delete test users
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(viewUser.userId);
    cy.deleteUserViaApi(editUser.userId);

    // reset checkbox state conditionally
    // if (isChecked) {
    //     cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    //     cy.getAdminToken();
    //     cy.visit('/settings/erm/general');
    //     cy.get('#hideEResourcesFunctionality').check(); // re-check the checkbox
    //     cy.logout();
    //   }
  });

  // after('reset checkbox state conditionally', () => {
  //   if (isChecked) {
  //     cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
  //     cy.getAdminToken();
  //     cy.visit('/settings/erm/general');
  //     cy.get('#hideEResourcesFunctionality').check(); // re-check the checkbox
  //     cy.logout();
  //   }
  // });

  describe('do not hide internal agreements knowledgebase', () => {
    it('should not hide internal agreements knowledgebase', () => {
      // do not hide internal agreements knowledgebase
      console.log('settings');
      cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
      cy.getAdminToken();
      cy.visit('/settings/erm/general');
      cy.expect(hideKbCheckbox.exists());
      // cy.get(hideKbCheckbox);
      // cy.do(hideKbCheckbox.uncheck());
      // cy.do(Button('Save').click());
      // cy.get('#paneHeaderpane-agreements-settings-general').within(() => {
      // cy.get('#hideEResourcesFunctionality').then(($checkbox) => {
      //   isChecked = $checkbox.is(':checked'); // store checkbox state
      //   console.log('isChecked %o', isChecked);
      //   if (isChecked) {
      //     cy.wrap($checkbox).click(); // uncheck the checkbox
      //     cy.get('#clickable-save-agreements-general-settings').click(); // click the submit button
      //   }
      //   // });
      // });
      // cy.logout();
    });
  });

  // describe('user actions', () => {
  //   describe('viewUser actions', () => {
  //     before(() => {
  //       console.log('login viewUser');
  //       cy.login(viewUser.username, viewUser.password);
  //       cy.getToken(viewUser.username, viewUser.password);
  //     });

  //     after(() => {
  //       console.log('logout viewUser');
  //       cy.logout();
  //     });

  //     it('should not be possible to visit the Local KB admin app', () => {
  //       cy.visit('/local-kb-admin');
  //       cy.contains("You don't have permission to view this app/record");
  //     });
  //   });

  //   describe('editUser actions', () => {
  //     before(() => {
  //       console.log('login editUser');
  //       cy.login(editUser.username, editUser.password);
  //       cy.getToken(editUser.username, editUser.password);
  //     });

  //     after(() => {
  //       console.log('logout viewUser');
  //       cy.logout();
  //     });

  //     it('should be possible to visit the Local KB admin app', () => {
  //       cy.do(AppList().navTo('Local KB admin')).then(() => {
  //         cy.url().should('include', '/local-kb-admin');
  //       });
  //     });
  //   });
  // });
});
