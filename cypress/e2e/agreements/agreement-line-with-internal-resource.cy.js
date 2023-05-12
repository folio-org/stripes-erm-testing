import {
  Accordion,
  Button,
  including,
  MultiColumnList,
  MultiColumnListCell,
  Pane,
} from '@folio/stripes-testing';

import { getRandomPostfix } from '../../support/utils/stringTools';
import { AppListItem } from '../../../interactors';
import AgreementAppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementFormInteractor from '../../support/fragments/agreements/AgreementFormInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import AgreementLineViewInteractor from '../../support/fragments/agreements/AgreementLineViewInteractor';
import AgreementsSettingsInteractor from '../../support/fragments/agreements/AgreementsSettingsInteractor';

import LocalKBAdminAppInteractor from '../../support/fragments/local-kb-admin/AppInteractor';

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
// FIXME these should be split up between more interactors, such as BasketInterator, LocalKBAdminInteractor, AgreementViewInteractor
const addPackageToBasketButton = Button('Add package to basket');
const createNewAgreementButton = Button('Create new agreement');
const localKbSearchButton = Button('Local KB search');
const packagesButton = Button('Packages');
const platformsButton = Button('Platforms');
const saveAndCloseButton = Button('Save & close');
const titlesButton = Button('Titles');
const openBasketButton = Button({ id: 'open-basket-button' });

// checkbox
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before('before hook', () => {
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

    console.log('check if hideKbCheckbox is unchecked');
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
    AgreementsSettingsInteractor.ensureHideAgreementsKBUnchecked();
    cy.logout();
  });

  after(() => {
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(viewUser.userId);

    console.log('delete agreement line and agreement');
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.visit('/erm/agreements');
    AgreementAppInteractor.searchAgreement(agreementName);
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
    }
  });

  function testLocalKbSearch() {
    it('should select "Local KB search"', () => {
      cy.do(localKbSearchButton.click()).then(() => {
        AgreementAppInteractor.filterPanePresent('kb-tab-filter-pane');
        cy.expect(packagesButton.exists());
        cy.expect(titlesButton.exists());
        cy.expect(platformsButton.absent());
      });
    });
  }

  function testSelectPackagesAndSearch(mode) {
    it('should select "Packages" tab, search and find package', () => {
      cy.do(packagesButton.click()).then(() => {
        AgreementAppInteractor.searchPackage(packageName);
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
        LocalKBAdminAppInteractor.openLocalKbAdminApp();
      });

      it('should create a json import job and await completion', () => {
        LocalKBAdminAppInteractor.uploadJsonFileAndAwaitCompletion(fileName);
      });

      it('should open the agreements app', () => {
        AgreementAppInteractor.openAgreementsApp();
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
          cy.expect(MultiColumnListCell(packageName).exists());
          cy.get('input[type="checkbox"]').eq(1).should('be.checked');
          cy.expect(createNewAgreementButton.exists());
        }));
      });

      it('should create new agreement', () => {
        // TODO: refactor this test after ERM-2421, see Scenario 4
        // https://issues.folio.org/browse/ERM-2421
        cy.do(createNewAgreementButton.click().then(() => {
          cy.expect(AgreementFormInteractor.paneExists());
        }));
        AgreementFormInteractor.fill();
        AgreementFormInteractor.fillName(agreementName);
        cy.expect(saveAndCloseButton.is({ visible: true }));
        cy.do(saveAndCloseButton.click());
      });

      it('should display agreement with agreement line and resource', () => {
        AgreementViewInteractor.paneExists(agreementName);
        cy.expect(Accordion('Agreement lines').exists());
        cy.do(Accordion('Agreement lines').clickHeader());
        cy.expect(MultiColumnList('agreement-lines').exists());
        cy.expect(MultiColumnList('eresources-covered').exists());
        cy.get('#agreement-lines')
          .contains('div', packageName)
          .should('have.text', packageName);
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
        AgreementAppInteractor.openAgreementsApp();
      });

      testLocalKbSearch();
      testSelectPackagesAndSearch('view');
    });
  });
});

