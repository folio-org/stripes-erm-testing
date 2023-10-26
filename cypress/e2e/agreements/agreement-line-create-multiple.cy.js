import { MultiColumnListCell, Modal, Button } from '../../../interactors';

import { getRandomPostfix } from '../../support/utils/stringTools';
import DateTools from '../../support/utils/dateTools';

import AgreementAppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import LocalKBAdminAppInteractor from '../../support/fragments/local-kb-admin/AppInteractor';
import AgreementLineFormInteractor from '../../support/fragments/agreements/AgreementLineFormInteractor';
import PackageViewInteractor from '../../support/fragments/agreements/PackageViewInteractor';
import AgreementLineViewInteractor from '../../support/fragments/agreements/AgreementLineViewInteractor';

// file - package - agreement
const fileName = 'simple_package_for_updates_1.json';
const packageName = 'Simple package to test updating package metadata';
const agreementName = `Agreement test ${getRandomPostfix()}`;
const description = `Agreement line test description ${getRandomPostfix()}`;
const note = `Agreement line test note ${getRandomPostfix()}`;

// agreement
const agreement = {
  name: agreementName,
  status: 'Active',
  startDate: DateTools.getCurrentDate(),
};

let agreementId = null;

// users
const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest',
};

const editPermissions = [
  'ui-agreements.agreements.edit',
  'ui-agreements.resources.edit',
  'ui-local-kb-admin.jobs.edit',
];

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest',
};

const viewPermissions = [
  'ui-agreements.agreements.view',
  'ui-agreements.resources.view',
];

describe('Agreement line test', () => {
  before('before hook', () => {
    console.log('createUser');
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);

    cy.getAdminToken();
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.createAgreementViaApi(agreement).then((res) => {
      agreementId = res?.id;
    });
    cy.getPackages({
      match: 'name',
      term: packageName,
    }).then((packages) => {
      if (packages?.length === 0) {
        LocalKBAdminAppInteractor.openLocalKbAdminApp();
        LocalKBAdminAppInteractor.uploadJsonFileAndAwaitCompletion(fileName);
      }
    });
    cy.visit('/erm/agreements');
    AgreementAppInteractor.openLocalKB();
    AgreementAppInteractor.searchForPackage(packageName);
    PackageViewInteractor.addToBasket();
    cy.logout();
  });

  after(() => {
    console.log('delete users');
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(viewUser.userId);

    console.log('delete agreement line and agreement');
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAgreement(agreementId, { expandItems: true }).then((res) => {
      res?.items?.forEach((line) => {
        cy.deleteAgreementLineViaApi(agreementId, line?.id);
      });
      console.log(res);
    });
    cy.deleteAgreementViaApi(agreementId);
    cy.logout();
  });

  describe('user actions', () => {
    describe('editUser actions', () => {
      before(() => {
        cy.login(editUser.username, editUser.password);
        cy.getToken(editUser.username, editUser.password);
      });

      after(() => {
        cy.logout();
      });

      it('should open the agreements app', () => {
        AgreementAppInteractor.openAgreementsApp();
      });

      it('select agreement from results list', () => {
        AgreementAppInteractor.searchAgreement(agreementName);
        AgreementViewInteractor.paneExists(agreementName);
      });

      it('expand agreement lines accordion in agreement view', () => {
        AgreementViewInteractor.openAgreementLinesAccordion();
      });

      it('open agreement line accordion actions and click new agreement line', () => {
        AgreementViewInteractor.newAgreementLine();
      });

      it('select e-resource from selection', () => {
        AgreementLineFormInteractor.selectEresource(packageName);
      });

      it('link e-resource from selection', () => {
        AgreementLineFormInteractor.linkSelectedEresource();
      });

      it('check "create another" option', () => {
        AgreementLineFormInteractor.checkCreateAnother(true);
      });

      it('save but dont close agreement line', () => {
        AgreementLineFormInteractor.save();
        AgreementLineFormInteractor.unlinkSelectedEresource();
      });

      it('click description field then note to check validation', () => {
        AgreementLineFormInteractor.checkDescriptionIsNotValid();
      });

      it('fill description field and re-check validation', () => {
        AgreementLineFormInteractor.fill({ description });
        AgreementLineFormInteractor.checkDescriptionIsValid();
      });

      it('save but dont close agreement line', () => {
        AgreementLineFormInteractor.save();
      });

      it('fill note field', () => {
        AgreementLineFormInteractor.fillNote({ note });
      });

      it('uncheck "create another" and save & close agreementline form', () => {
        AgreementLineFormInteractor.checkCreateAnother(false);
        // cy.wait(600);
        AgreementLineFormInteractor.saveAndClose();
      });

      it('close agreement line view', () => {
        AgreementLineViewInteractor.closePane('pane-view-agreement-line');
      });

      it('should display agreement with agreement line and resource', () => {
        AgreementViewInteractor.paneExists(agreementName);
        AgreementViewInteractor.openAgreementLinesAccordion();
        cy.get('#agreement-lines')
          .contains('div', packageName)
          .should('have.text', packageName);
        cy.get('#agreement-lines')
          .contains('div', description)
          .should('have.text', description);
      });

      it('click view in agreement line search button', () => {
        AgreementViewInteractor.viewAgreementLineSearch();
      });

      it('should display two agreement lines linked to the agreement', () => {
        cy.expect(MultiColumnListCell(packageName).exists());
        cy.expect(MultiColumnListCell(description).exists());
      });

      it('Select one of the agreement lines in the search and filter results', () => {
        cy.do(MultiColumnListCell(note).click());
        AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
      });

      it('Click Actions button', () => {
        AgreementLineViewInteractor.openOptions();
        cy.expect(AgreementLineViewInteractor.actionsButton.exists());
        cy.do(AgreementLineViewInteractor.actionsButton.click());
        cy.do(AgreementLineViewInteractor.actionsButton.click()).then(() => {
          cy.expect(AgreementLineViewInteractor.editButton.exists());
          cy.expect(AgreementLineViewInteractor.deleteButton.exists());
        });
      });

      it('Select Delete in Actions menu', () => {
        cy.do(AgreementLineViewInteractor.deleteButton.click());
        cy.expect(Modal('Delete agreement line').exists());
      });

      it('Select Delete in  deletion confirmation dialogue', () => {
        cy.expect(Button('Delete').exists());
        cy.do(Button('Delete').click());
        // AgreementViewInteractor.viewAgreementLineSearch();
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

      it('should open the agreements app', () => {
        AgreementAppInteractor.openAgreementsApp();
      });

      it('select agreement from results list', () => {
        AgreementAppInteractor.searchAgreement(agreementName);
        AgreementViewInteractor.paneExists(agreementName);
      });

      it('expand agreement lines accordion in agreement view', () => {
        AgreementViewInteractor.openAgreementLinesAccordion();
        cy.get('#agreement-lines')
          .contains('div', packageName)
          .should('have.text', packageName);
        cy.get('#agreement-lines')
          .contains('div', description)
          .should('have.text', description);
      });

      it('click view in agreement line search button', () => {
        AgreementViewInteractor.viewAgreementLineSearch();
      });

      it('should display two agreement lines linked to the agreement', () => {
        cy.expect(MultiColumnListCell(packageName).exists());
        cy.expect(MultiColumnListCell(description).exists());
      });

      it('Select one of the agreement lines in the search and filter results', () => {
        cy.do(MultiColumnListCell(packageName).click());
        AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
        cy.expect(AgreementLineViewInteractor.actionsButton.absent());
      });
    });
  });
});
