import {
  Button,
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


describe('Agreement line with internal resource', () => {
  before('create test users', () => {
    console.log('createUser');
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);
    cy.createUserWithPwAndPerms(editUser, editPermissions);
  });

  before('do not hide internal agreements knowledgebase', () => {

  });

  after('delete test users', () => {
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(viewUser.userId);
    cy.deleteUserViaApi(editUser.userId);
  });

  describe('user actions', () => {
    describe('viewUser actions', () => {
      before(() => {
        console.log('login viewUser');
        cy.login(viewUser.username, viewUser.password);
        cy.getToken(viewUser.username, viewUser.password);
      });

      after(() => {
        console.log('logout viewUser');
        cy.logout();
      });

      it('should not be possible to visit the Local KB admin app', () => {
        cy.visit('/local-kb-admin');
        cy.contains("You don't have permission to view this app/record");
      });
    });

    describe('editUser actions', () => {
      before(() => {
        console.log('login editUser');
        cy.login(editUser.username, editUser.password);
        cy.getToken(editUser.username, editUser.password);
      });

      after(() => {
        console.log('logout viewUser');
        cy.logout();
      });

      it('should be possible to visit the Local KB admin app', () => {
        cy.do(AppList().navTo('Local KB admin')).then(() => {
          cy.url().should('include', '/local-kb-admin');
        });
      });
    });
  });
});
