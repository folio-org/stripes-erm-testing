import {
  Accordion,
  Button,
  Checkbox,
  DropdownMenu,
  including,
  KeyValue,
  MultiColumnList,
  MultiColumnListCell,
  Pane,
} from '@folio/stripes-testing';

import { getRandomPostfix } from '../../support/utils/stringTools';
import { AppListItem, HeadlineInteractor as Headline } from '../../../interactors';
import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementFormInteractor from '../../support/fragments/agreements/AgreementFormInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import AgreementLineViewInteractor from '../../support/fragments/agreements/AgreementLineViewInteractor';

// file - package - agreement
const fileName = 'simple_package_for_updates_1.json';
const packageName = 'Simple package to test updating package metadata';
const agreementName = `Agreement line internal resource test ${getRandomPostfix()}`;

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
const addPackageToBasketButton = Button('Add package to basket');
const chooseFileButton = Button('or choose file');
const createNewAgreementButton = Button('Create new agreement');
const jsonButton = DropdownMenu().find(Button('New JSON import job'));
const kbartButton = DropdownMenu().find(Button('New KBART import job'));
const localKbSearchButton = Button('Local KB search');
const packagesButton = Button('Packages');
const platformsButton = Button('Platforms');
const saveAndCloseButton = Button('Save & close');
const titlesButton = Button('Titles');
const openBasketButton = Button({ id: 'open-basket-button' });

// checkbox
const hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase'); // Checkbox({ id: 'hideEResourcesFunctionality' })
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before(() => {
    console.log('createUser');
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);

    console.log('do not hide internal agreements knowledgebase');
    cy.getAdminToken();
    cy.getAgreementsGeneralSettings().then((settings) => {
      if (settings.hideEResourcesFunctionality === true) {
        // remember value and set to false
        isChecked = true;
        cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: false });
      }
    });
    // TODO: check if hideKbCheckbox is unchecked
    // cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    // cy.getAdminToken();
  });

  after(() => {
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(viewUser.userId);

    console.log('delete agreement line and agreement');
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.visit('/erm/agreements');
    AppInteractor.searchAgreement(agreementName);
    AgreementViewInteractor.paneExists(agreementName);
    cy.expect(Accordion('Agreement lines').exists());
    cy.do(Accordion('Agreement lines').clickHeader());
    cy.expect(MultiColumnList('agreement-lines').exists());
    cy.do(MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 }));
    AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
    AgreementLineViewInteractor.delete('pane-view-agreement-line');
    AgreementViewInteractor.paneExists(agreementName);
    AgreementViewInteractor.delete(agreementName);
    cy.logout();

    console.log('set hideEResourcesFunctionality checkbox back to its original state');
    if (isChecked === true) {
      cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: true });
      cy.getAgreementsGeneralSettings();
    }
  });

  function testLocalKbSearch() {
    it('should select "Local KB search"', () => {
      // kb-tab-filter-pane
      cy.do(localKbSearchButton.click()).then(() => {
        AppInteractor.filterPanePresent('kb-tab-filter-pane');
        cy.expect(packagesButton.exists());
        cy.expect(titlesButton.exists());
        cy.expect(platformsButton.absent());
      });
    });
  }

  function testSelectPackagesAndSearch(mode) {
    it('should select "Packages" tab, search and find package', () => {
      cy.do(packagesButton.click()).then(() => {
        AppInteractor.searchPackage(packageName);
        cy.expect(Pane(including(packageName)).is({ visible: true, index: 2 }));
        if (mode === 'edit') {
          cy.expect(addPackageToBasketButton.exists());
        } else if (mode === 'view') {
          cy.expect(addPackageToBasketButton.absent());
        }
      });
    });
  }

  describe('user actions', () => {
    describe('editUser actions', () => {
      before(() => {
        cy.login(editUser.username, editUser.password);
        cy.getToken(editUser.username, editUser.password);
      });

      after(() => {
        cy.logout();
      });

      it('should open the Local KB admin app', () => {
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

      it('should wait until package is submitted', () => {
        cy.get(Pane(including(`Import package from ${fileName}`)));
        // cy.waitUntil(() => cy.get(Pane(including(`Import package from ${fileName}`)))
        //   // .then(cy.expect(KeyValue('Running status').has({ value: 'Ended' }))), { timeout: 60000, interval: 5000 });
        //   .then(cy.contains('Ended').should('be.visible')), { timeout: 60000, interval: 5000 });
        // cy.waitUntil(() => cy.get(Pane(including(`Import package from ${fileName}`)))
        cy.waitUntil(() => cy.reload()
          .then(() => {
            // return cy.contains('Expected Content').should('be.visible');
            console.log('reload');
            // cy.reload().then(() => cy.expect(KeyValue('Running status').has({ value: 'Ended' })));
            // cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
            cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
          }), { timeout: 60000, interval: 5000 });
      });

      it('should open the agreements app', () => {
        AppInteractor.openAgreementsApp();
      });

      testLocalKbSearch();
      testSelectPackagesAndSearch('edit');

      it('should add package to basket', () => {
        addPackageToBasketButton.click().then(() => {
          cy.expect(openBasketButton.exists());
        });
      });

      it('should view basket', () => {
        cy.do(openBasketButton.click().then(() => {
          cy.expect(Pane(including('ERM basket')).exists());
          cy.expect(MultiColumnList().exists());
          // TODO:
          // package packageName displayed in the MCL,
          // the single MCL row is selected with the checkbox
          console.log('MultiColumnListCell(packageName) %o', MultiColumnListCell(packageName));
          cy.expect(MultiColumnListCell(packageName).is({ selected: false })); // TODO: this is not working
          cy.expect(createNewAgreementButton.exists());
        }));
      });

      it('should create new agreement', () => {
        cy.do(createNewAgreementButton.click().then(() => {
          cy.expect(AgreementFormInteractor.paneExists());
          // TODO In the Agreement line accordion there is one agreement line card for packageName
        }));
        AgreementFormInteractor.fill();
        AgreementFormInteractor.fillName(agreementName);
        cy.expect(saveAndCloseButton.is({ visible: true }));
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        cy.do(saveAndCloseButton.click());
      });

      it('should display agreement with agreement line and resource', () => {
        AgreementViewInteractor.paneExists(agreementName);
        cy.expect(Accordion('Agreement lines').exists());
        cy.do(Accordion('Agreement lines').clickHeader());
        cy.expect(MultiColumnList('agreement-lines').exists());
        cy.expect(MultiColumnList('eresources-covered').exists());
        // TODO
        // There is one Agreement line with the packageName in the agreement-lines MCL
        // cy.expect(MultiColumnListCell(packageName).is({ content: true }));
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
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

      it('should not open the Local KB admin app', () => {
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

