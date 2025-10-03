import { getRandomPostfix } from '../../support/utils/stringTools';
import { Accordion, AppListItem } from '../../../interactors';
import AgreementAppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import AgreementLineViewInteractor from '../../support/fragments/agreements/AgreementLineViewInteractor';
import AgreementsSettingsInteractor from '../../support/fragments/agreements/AgreementsSettingsInteractor';

import BasketInteractor from '../../support/fragments/agreements/BasketInteractor';
import PackageViewInteractor from '../../support/fragments/agreements/PackageViewInteractor';

import { SIMPLE_PACKAGE } from '../../constants/jsonImports';

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

// checkbox
let isChecked = false; // variable to store checkbox state

describe('Agreement line with internal resource', () => {
  before('before hook', () => {
    console.log('createUser');
    cy.createUserWithPwAndPerms({
      userProperties: editUser,
      permissions:  editPermissions
    });
    cy.createUserWithPwAndPerms({
      userProperties: viewUser,
      permissions:  viewPermissions
    });

    console.log('do not hide internal agreements knowledgebase');
    cy.getAgreementsGeneralSettings().then((settings) => {
      if (settings?.hideEResourcesFunctionality === true) {
        // remember value and set to false
        isChecked = true;
        cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: false });
      }
    });

    console.log('check if hideKbCheckbox is unchecked');
    cy.login(Cypress.env('diku_login'), Cypress.env('diku_password'));
    AgreementsSettingsInteractor.ensureHideAgreementsKBUnchecked();
    cy.logout();
  });

  after(() => {
    console.log('delete users');
    cy.deleteUserViaApi({ userId: editUser.userId });
    cy.deleteUserViaApi({ userId: viewUser.userId });

    console.log('delete agreement line and agreement');
    cy.deleteAgreementLineViaApi({ agreementId: Cypress.env('agreementId'), agreementLineId: Cypress.env('agreementLineId') });
    cy.deleteAgreementViaApi({ agreementId: Cypress.env('agreementId') });

    console.log('set hideEResourcesFunctionality checkbox back to its original state');
    if (isChecked === true) {
      cy.setAgreementsGeneralSettings({ hideEResourcesFunctionality: true });
    }
  });

  function testLocalKbSearch() {
    it('should select "Local KB search"', () => {
      AgreementAppInteractor.openLocalKB();
      AgreementAppInteractor.filterPanePresent('kb-tab-filter-pane');
      cy.expect(AgreementAppInteractor.packagesButton.exists());
      cy.expect(AgreementAppInteractor.titlesButton.exists());
      cy.expect(AgreementAppInteractor.platformsButton.absent());
    });
  }

  function testSelectPackagesAndSearch(mode) {
    it('should select "Packages" tab, search and find package', () => {
      AgreementAppInteractor.searchForPackage(SIMPLE_PACKAGE.packageName);
      if (mode === 'edit') {
        cy.expect(PackageViewInteractor.addToBasketButton.exists());
      } else if (mode === 'view') {
        cy.expect(PackageViewInteractor.addToBasketButton.absent());
      }
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

      it('should ensure the package necessary for these tests is in the system', () => {
        // Get package call inside here will work as it's called with editUser's perms
        AgreementAppInteractor.ensurePackage({
          packageName: SIMPLE_PACKAGE.packageName,
          fileName: SIMPLE_PACKAGE.fileName
        });
      });

      it('should open the agreements app', () => {
        AgreementAppInteractor.openAgreementsApp();
      });

      testLocalKbSearch();
      testSelectPackagesAndSearch('edit');

      it('should add package to basket', () => {
        PackageViewInteractor.addToBasket();
        cy.expect(AgreementAppInteractor.openBasketButton.exists());
      });

      it('should view basket', () => {
        AgreementAppInteractor.openBasket();
        BasketInteractor.waitLoading();
        BasketInteractor.checkResourceIsInBasket(SIMPLE_PACKAGE.packageName);
        BasketInteractor.ensureBasketResourceIsSelected();
      });

      it('should create new agreement', () => {
        BasketInteractor.createAgreement({
          name: agreementName,
        });
      });

      it('should display agreement with agreement line and resource', () => {
        AgreementViewInteractor.paneExists(agreementName);
        AgreementViewInteractor.openAgreementLinesAccordion();
        cy.get('#agreement-lines')
          .contains('div', SIMPLE_PACKAGE.packageName)
          .should('have.text', SIMPLE_PACKAGE.packageName);
      });

      // this is only for using the ids in the delete via api calls after the tests
      it('should open agreement line view to get agreement and line ids', () => {
        // have to close the already open accordion because it's clicked to open again in 'openFirstAgreementLine'
        cy.do(Accordion('Agreement lines').clickHeader());
        AgreementViewInteractor.openFirstAgreementLine();
        AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
        cy.getAllIdsFromURL().then(([agreementId, agreementLineId]) => {
          Cypress.env('agreementId', agreementId);
          Cypress.env('agreementLineId', agreementLineId);
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

