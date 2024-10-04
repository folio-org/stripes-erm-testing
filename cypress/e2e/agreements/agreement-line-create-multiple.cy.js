import { Button, Modal, MultiColumnListCell } from '../../../interactors';

import DateTools from '../../support/utils/dateTools';
import { getRandomPostfix } from '../../support/utils/stringTools';
import InteractorsTools from '../../support/utils/interactorsTools';

import AgreementLineFormInteractor from '../../support/fragments/agreements/AgreementLineFormInteractor';
import AgreementLineViewInteractor from '../../support/fragments/agreements/AgreementLineViewInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import AgreementAppInteractor from '../../support/fragments/agreements/AppInteractor';
import PackageViewInteractor from '../../support/fragments/agreements/PackageViewInteractor';

import { SIMPLE_PACKAGE } from '../../constants/jsonImports';

// file - package - agreement
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
    cy.createUserWithPwAndPerms({
      userProperties: editUser,
      permissions:  editPermissions
    });
    cy.createUserWithPwAndPerms({
      userProperties: viewUser,
      permissions:  viewPermissions
    });

    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.createAgreementViaApi({ agreement }).then((res) => {
      agreementId = res?.id;
    });

    AgreementAppInteractor.ensurePackage({
      packageName: SIMPLE_PACKAGE.packageName,
      fileName: SIMPLE_PACKAGE.fileName
    });
    cy.visit('/erm/agreements');
    AgreementAppInteractor.openLocalKB();
    AgreementAppInteractor.searchForPackage(SIMPLE_PACKAGE.packageName);
    PackageViewInteractor.addToBasket();
    cy.logout();
  });

  after(() => {
    cy.deleteUserViaApi({ userId: editUser.userId });
    cy.deleteUserViaApi({ userId: viewUser.userId });

    console.log('delete agreement line and agreement');
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAgreement(agreementId, { expandItems: true }).then((res) => {
      res?.items?.forEach((line) => {
        cy.deleteAgreementLineViaApi({ agreementId, agreementLineId: line?.id });
      });
      console.log(res);
    });
    cy.deleteAgreementViaApi({ agreementId });
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
        AgreementLineFormInteractor.selectEresource(SIMPLE_PACKAGE.packageName);
      });

      it('link e-resource from selection', () => {
        AgreementLineFormInteractor.linkSelectedEresource();
      });

      it('check "create another" option', () => {
        AgreementLineFormInteractor.checkCreateAnother(true);
      });

      it('save but dont close agreement line', () => {
        AgreementLineFormInteractor.save();
        // Check desc field has emptied
        cy.expect(AgreementLineFormInteractor.getDescriptionField().has({ value: '' }));
      });

      it('touch description field to check validation', () => {
        // FIXME Idk if this is the "right" way, but it's certainly less brittle
        const descriptionField = AgreementLineFormInteractor.getDescriptionField();
        InteractorsTools.touchField(descriptionField);
        AgreementLineFormInteractor.checkDescriptionIsNotValid();
      });

      it('fill description field and re-check validation', () => {
        const descriptionField = AgreementLineFormInteractor.getDescriptionField();
        AgreementLineFormInteractor.fill({ description });
        InteractorsTools.touchField(descriptionField);
        AgreementLineFormInteractor.checkDescriptionIsValid();
      });

      it('fill note field', () => {
        AgreementLineFormInteractor.fillNote({ note });
      });

      it('uncheck "create another" and save & close agreementline form', () => {
        AgreementLineFormInteractor.checkCreateAnother(false);
        AgreementLineFormInteractor.saveAndClose();
      });

      it('close agreement line view', () => {
        AgreementLineViewInteractor.closePane('pane-view-agreement-line');
      });

      it('should display agreement with agreement line and resource', () => {
        AgreementViewInteractor.paneExists(agreementName);
        AgreementViewInteractor.openAgreementLinesAccordion();
        // This get should be done in the page interactor and with interactors
        cy.get('#agreement-lines')
          .contains('div', SIMPLE_PACKAGE.packageName)
          .should('have.text', SIMPLE_PACKAGE.packageName);
        cy.get('#agreement-lines')
          .contains('div', description)
          .should('have.text', description);
      });

      it('click view in agreement line search button', () => {
        AgreementViewInteractor.viewAgreementLineSearch();
      });

      it('should display two agreement lines linked to the agreement', () => {
        // This should be in the page interactor
        cy.expect(MultiColumnListCell(SIMPLE_PACKAGE.packageName).exists());
        cy.expect(MultiColumnListCell(description).exists());
      });

      it('Select one of the agreement lines in the search and filter results', () => {
        cy.do(MultiColumnListCell(note).click());
        AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
      });

      it('Click Actions button', () => {
        AgreementLineViewInteractor.openOptions();
        cy.expect(AgreementLineViewInteractor.actionsButton.exists());
        // FIXME This isn't how to use cy.do
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
          .contains('div', SIMPLE_PACKAGE.packageName)
          .should('have.text', SIMPLE_PACKAGE.packageName);
        // This one was previsouly deleted... How did this ever pass???
        /* cy.get('#agreement-lines')
          .contains('div', description)
          .should('have.text', description); */
      });

      it('click view in agreement line search button', () => {
        AgreementViewInteractor.viewAgreementLineSearch();
      });

      it('should display two agreement lines linked to the agreement', () => {
        cy.expect(MultiColumnListCell(SIMPLE_PACKAGE.packageName).exists());
        //cy.expect(MultiColumnListCell(description).exists());
      });

      it('Select one of the agreement lines in the search and filter results', () => {
        cy.do(MultiColumnListCell(SIMPLE_PACKAGE.packageName).click());
        AgreementLineViewInteractor.paneExists('pane-view-agreement-line');
        cy.expect(AgreementLineViewInteractor.actionsButton.absent());
      });
    });
  });
});
