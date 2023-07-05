import { KeyValue } from '@folio/stripes-testing';
import { HeadlineInteractor as Headline } from '../../../interactors';
import DateTools from '../../support/utils/dateTools';
import { getRandomPostfix } from '../../support/utils/stringTools';

import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

const agreementName = 'Test: ' + generateItemBarcode();

const agreement = {
  name: agreementName,
  status: 'Active',
  startDate: DateTools.getCurrentDate(),
};

const refdataStatusDesc = 'SubscriptionAgreement.AgreementStatus';

// users
const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest'
};

const editPermissions = ['ui-agreements.agreements.delete', 'ui-agreements.agreements.edit'];

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest'
};

const viewPermissions = ['ui-agreements.agreements.view'];

describe('Agreement create and delete', () => {
  before(() => {
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);
    cy.getAdminToken();
    cy.getAgreementsRefdataValues(refdataStatusDesc).then((refdata) => {
      if (refdata.every(obj => obj.label !== agreement.status)) {
        cy.getFirstAgreementsRefdataLabel(refdataStatusDesc)
          .then((refdataLabel) => {
            agreement.status = refdataLabel;
          });
      }
    });
  });

  after(() => {
    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(viewUser.userId);
  });

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
    });

    describe('create agreement', () => {
      it('should open the agreements app and see "New" button', () => {
        AppInteractor.openAgreementsApp();
        cy.expect(AppInteractor.newButton.exists());
      });

      it('should create agreement', () => {
        AppInteractor.createAgreement(agreement);
      });
    });

    describe('view agreement', () => {
      before(() => {
        cy.url().then(($url) => {
          const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
          const agreementId = $url.match(regex)[0];
          cy.getAgreement(agreementId).its('dateCreated').as('dateCreated');
        });
      });

      it('should see correct agreement values in view pane', () => {
        AgreementViewInteractor.paneExists(agreementName);
        cy.expect(KeyValue('Status').has({ value: agreement.status }));
        cy.expect(KeyValue('Start date').has({ value: DateTools.getDateNoZeros(agreement.startDate) }));
        cy.expect(KeyValue('Period start').has({ value: DateTools.getDateNoZeros(agreement.startDate) }));
        cy.expect(Headline(agreement.name).exists());
      });

      // it has to be 'function ()' and NOT '() =>' because otherwise the alias can't be accessed with this.*
      it('should open "Record last updated" information and see correct values', function () {
        cy.get('[id=agreementInfoRecordMeta]').click().within(() => {
          cy.contains('Record created: ' + DateTools.getFormattedDateWithTime(this.dateCreated));
          cy.contains('Record last updated: ' + DateTools.getFormattedDateWithTime(this.dateCreated));
        });
      });
    });

    describe('delete agreement', () => {
      it('should open actions button with options', () => {
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
