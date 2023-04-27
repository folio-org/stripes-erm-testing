import {
  Button,
  Dropdown,
  DropdownMenu,
  including,
  KeyValue,
  Pane,
  SearchField,
} from '@folio/stripes-testing';

import { AppListItem, HeadlineInteractor as Headline } from '../../../interactors';
import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import { getRandomPostfix } from '../../support/utils/stringTools';

// file - package
const fileName = 'simple_package_for_updates_1.json';
const packageName = 'Simple package to test updating package metadata';

// users
const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest'
};

const editPermissions = ['ui-agreements.agreements.edit', 'ui-agreements.resources.edit', 'ui-local-kb-admin.jobs.edit'];

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest'
};

const viewPermissions = ['ui-agreements.agreements.view', 'ui-agreements.resources.view'];

// buttons
const actionsButton = Pane(including('Local KB admin')).find(Button('Actions'));
const jsonButton = DropdownMenu().find(Button('New JSON import job'));
const kbartButton = DropdownMenu().find(Button('New KBART import job'));
const chooseFileButton = Button('or choose file');
const saveAndCloseButton = Button('Save & close');

describe('Agreement line with internal resource', () => {
  before('create test users', () => {
    console.log('createUser');
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);
  });

  // before('do not hide internal agreements knowledgebase', () => {

  // });

  after('delete test users', () => {
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(viewUser.userId);
  });

  function testLocalKbSearch() {
    it('should select "Local KB search"', () => {
      // kb-tab-filter-pane
      cy.do(Button('Local KB search').click()).then(() => {
        AppInteractor.filterPanePresent('kb-tab-filter-pane');
        cy.expect(Button('Packages').exists());
        cy.expect(Button('Titles').exists());
        cy.expect(Button('Platforms').absent());
      });
    });
  }

  function testSelectPackagesAndSearch(mode) {
    it('should select "Packages" tab, search and find package', () => {
      cy.do(Button('Packages').click()).then(() => {
        AppInteractor.searchPackage(packageName);
        cy.expect(Pane(including(packageName)).is({ visible: true, index: 2 }));
        if (mode === 'edit') {
          cy.expect(Button('Add package to basket').exists());
        } else if (mode === 'view') {
          cy.expect(Button('Add package to basket').absent());
        }
      });
    });
  }

  describe('user actions', () => {
    describe('editUser actions', () => {
      before(() => {
        cy.login(editUser.username, editUser.password);
        cy.getToken(editUser.username, editUser.password);
        // cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
        // cy.getAdminToken();
      });

      after(() => {
        cy.logout();
      });

      function reloadPaneUntilTextAppears(paneSelector, text) {
        // cy.get(paneSelector).then(($pane) => {
        // if (!$pane.text().includes(text)) {
        // if (KeyValue('Running status').has({ value: 'Queued' })) {
        // if (cy.contains('Some weird text').should('not.be.visible')) {
        if (cy.get('#pane-view-job').should('not.have.text', 'Some weird text')) {
          // console.log('pane.text %o', $pane.text);
          cy.reload();
          console.log('reload');
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(5000); // Wait for 5 seconds before reloading again
          console.log('reload again');
          reloadPaneUntilTextAppears(paneSelector, text); // Recursively call the function until the text appears
        }
        // });
      }

      function reloadUntilTextAppears() {
        // cy.get(Pane(including('Import package from'))).then(($pane) => {
        //   console.log('pane: ', $pane);
        // if (!$pane.text().includes(text)) {
        cy.get(Pane(including('Import package from')));
        console.log('reloadUntilTextAppears');
        if (cy.expect(KeyValue('Running status').has({ value: 'Ended' }).absent())) {
          cy.reload();
          console.log('reload');
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(10000); // Wait for 5 seconds before reloading again
          reloadUntilTextAppears(); // Recursively call the function until the text appears
        }
        // });
      }

      it('should be possible to open the Local KB admin app', () => {
        AppInteractor.openLocalKbAdminApp();
      });

      it('should open actions menu and see options', () => {
        cy.expect(actionsButton.exists());
        cy.do(actionsButton.click());
        cy.expect(kbartButton.exists());
        cy.expect(jsonButton.exists());
      });

      it('should select json import option', () => {
        cy.do(jsonButton.click());
        cy.expect(Pane(including('New JSON job')).exists());
        cy.expect(chooseFileButton.exists());
      });

      it('should attach a file', () => {
        // `force: true` is mandatory because "element `<input>` is not visible because it has CSS property: `display: none`"
        cy.get('input[type=file]').selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop', force: true });
        cy.expect(KeyValue('File name').has({ value: fileName }));
        cy.expect(saveAndCloseButton.exists());
      });

      it('should click "Save & close" button to upload the file', () => {
        cy.do(saveAndCloseButton.click());
        // TODO: 'should display a toast message'
        cy.expect(Pane(including(`Import package from ${fileName}`)).exists());
        cy.expect(Headline(`Import package from ${fileName}`).exists());
        cy.expect(KeyValue('Running status').has({ value: 'Queued' }));
        cy.expect(KeyValue('Job Type').has({ value: 'File import' }));
      });

      // it('should reload the page until "Running status" is "Ended"', () => {
      //   // const paneSelector = '#pane-view-job';
      //   // cy.expect(paneSelector.exists());
      //   // cy.expect(KeyValue('Running status').has({ value: 'Queued' }));
      //   // reloadUntilTextAppears();
      //   // cy.get(paneSelector).focus();
      //   // reloadPaneUntilTextAppears(paneSelector, 'Ended');
      //   // eslint-disable-next-line cypress/no-unnecessary-waiting
      //   cy.wait(60000);
      //   cy.reload();
      //   cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
      //   // cy.contains('my text').should('be.visible'); // Confirm that the text is visible on the page
      //   // let jobEnded = false;
      //   // cy.expect(Pane(including(`Import package from ${fileName}`)).exists());
      //   // cy.expect(KeyValue('Running status').has({ value: 'Queued' }));
      //   // while (!jobEnded) {
      //   //   console.log('while loop', jobEnded);
      //   //   // cy.contains(KeyValue('Running status').has({ value: 'Ended' }))
      //   //   // eslint-disable-next-line no-loop-func
      //   //   cy.contains('Queued').then(($text) => {
      //   //     console.log('queued', $text);
      //   //     if ($text.length > 0) {
      //   //       jobEnded = true;
      //   //     }
      //   //   });
      //   //   cy.reload();
      //   //   // eslint-disable-next-line cypress/no-unnecessary-waiting
      //   //   cy.wait(50000);
      //   // }
      //   // cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
      // });

      it('should wait until package is submitted', () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(60000);
        cy.reload();
        cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
      });

      it('should open the agreements app', () => {
        AppInteractor.openAgreementsApp();
      });

      testLocalKbSearch();
      testSelectPackagesAndSearch('edit');

      it('should add package to basket', () => {
        Button('Add package to basket').click().then(() => {
          cy.expect(Button('View 1 item').exists());
        });
      });

      it('should view basket', () => {
        Button('View 1 item').click().then(() => {
          cy.expect(Pane(including('ERM basket')).exists());
          // TODO: package displayed in the MCL,
          // the single MCL row is selected with the checkbox
          cy.expect(Button('Create new agreement').exists());
        });
      });
    });

    describe('viewUser actions', () => {
      before(() => {
        cy.login(viewUser.username, viewUser.password);
        cy.getToken(viewUser.username, viewUser.password);
      });

      after(() => {
        cy.logout();
      });

      it('should not be possible to open the Local KB admin app', () => {
        cy.expect(AppListItem('Local KB admin').absent());
      });

      it('should open the agreements app', () => {
        AppInteractor.openAgreementsApp();
      });

      testLocalKbSearch();
      testSelectPackagesAndSearch('view');
    });
  });
});
