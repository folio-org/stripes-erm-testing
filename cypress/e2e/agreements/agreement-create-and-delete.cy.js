import { KeyValue } from '@folio/stripes-testing';
import { HeadlineInteractor as Headline } from '../../../interactors';
import DateTools from '../../support/utils/dateTools';
import { getRandomPostfix } from '../../support/utils/stringTools';

import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';
import AgreementsSettingsInteractor from '../../support/fragments/agreements/AgreementsSettingsInteractor';

const agreementName = 'Test: ' + generateItemBarcode();

const agreement = {
  name: agreementName,
  status: 'Active',
  startDate: DateTools.getCurrentDate()
};

// users
const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest'
};

const editPermissions = ['ui-agreements.agreements.edit'];

const editDeleteUser = {
  username: `editDeleteTest${getRandomPostfix()}`,
  password: 'editDeleteTest'
};

const editDeletePermissions = ['ui-agreements.agreements.delete', 'ui-agreements.agreements.edit'];

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest'
};

const viewPermissions = ['ui-agreements.agreements.view'];

describe('Agreement create and delete', () => {
  before(() => {
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(editDeleteUser, editDeletePermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);

    cy.getAdminToken();
    AgreementsSettingsInteractor.fetchStatusLabel(agreement);
  });

  after(() => {
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(editDeleteUser.userId);
    cy.deleteUserViaApi(viewUser.userId);
  });

  function createAgreement() {
    describe('create agreement', () => {
      it('should open the agreements app and see "New" button', () => {
        AppInteractor.openAgreementsApp();
        cy.expect(AppInteractor.newButton.exists());
      });

      it('should create agreement', () => {
        AppInteractor.createAgreement(agreement);
      });
    });
  }

  function viewAgreement() {
    describe('view agreement', () => {
      before(() => {
        cy.getIdFromURL().then(agreementId => {
          cy.getAgreement(agreementId).its('dateCreated').as('dateCreated');
        });
      });

      it('should see correct agreement values in view pane', () => {
        AgreementViewInteractor.paneExists(agreementName);
        cy.expect(KeyValue('Status').has({ value: agreement.status }));
        cy.expect(KeyValue('Start date').has({ value: DateTools.getDateNoZeros(agreement.startDate) }));
        cy.expect(KeyValue('Period start').has({ value: DateTools.getDateNoZeros(agreement.startDate) }));
        cy.expect(Headline(agreementName).exists());
      });

      // it has to be 'function ()' and NOT '() =>' because otherwise the alias can't be accessed with this.*
      it('should open "Record last updated" information and see correct values', function () {
        AgreementViewInteractor.recordMetadataInfo(this.dateCreated);
      });
    });
  }

  describe('view user actions', () => {
    before(() => {
      cy.login(viewUser.username, viewUser.password);
      cy.getToken(viewUser.username, viewUser.password);
    });

    after(() => {
      cy.logout();
    });

    it('should open the agreements app and do NOT see "New" button', () => {
      AppInteractor.openAgreementsApp();
      cy.expect(AppInteractor.newButton.absent());
    });
  });

  describe('edit user actions', () => {
    before(() => {
      cy.login(editUser.username, editUser.password);
      cy.getToken(editUser.username, editUser.password);
    });

    after(() => {
      cy.logout();

      // delete created agreement as admin because user has no delete permission
      cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
      cy.visit('/erm/agreements');
      AppInteractor.searchAgreement(agreementName);
      AgreementViewInteractor.paneExists(agreementName);
      AgreementViewInteractor.delete(agreementName);
      cy.logout();
    });

    createAgreement();
    viewAgreement();

    describe('actions dropdown', () => {
      it('should open actions dropdown w/o delete option', () => {
        cy.expect(AgreementViewInteractor.actionsButton.exists());
        cy.do(AgreementViewInteractor.actionsButton.click());
        cy.expect(AgreementViewInteractor.deleteButton.absent());
        cy.expect(AgreementViewInteractor.duplicateButton.exists());
        cy.expect(AgreementViewInteractor.editButton.exists());
        cy.expect(AgreementViewInteractor.exportJsonButton.exists());
      });
    });
  });

  describe('editDelete user actions', () => {
    before(() => {
      cy.login(editDeleteUser.username, editDeleteUser.password);
      cy.getToken(editDeleteUser.username, editDeleteUser.password);
    });

    after(() => {
      cy.logout();
    });

    createAgreement();
    viewAgreement();

    describe('delete agreement', () => {
      it('should open actions dropdown with options', () => {
        AgreementViewInteractor.openOptions();
        // close options because in next step Actions button will be clicked again
        cy.do(AgreementViewInteractor.actionsButton.click());
      });

      it('should delete the agreement', () => {
        AgreementViewInteractor.delete(agreementName);
        AgreementViewInteractor.paneDoesNotExist(agreementName);
        // Check it also no longer shows in the MCL
        AppInteractor.searchAgreement(agreementName);
        AppInteractor.agreementNotVisible(agreementName);
      });
    });
  });
});
