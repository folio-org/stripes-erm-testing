import generateItemBarcode from '../../support/utils/generateItemBarcode';
import DateTools from '../../support/utils/dateTools';

import Permissions from '../../support/dictionary/permissions';
import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementsSettingsInteractor from '../../support/fragments/agreements/AgreementsSettingsInteractor';

const agreement = {
  name: 'Search and filter test: ' + generateItemBarcode(),
  status: 'Active',
  startDate: DateTools.getCurrentDate()
};

// EXAMPLE fixed this cypress test using the stripes-testing patterns.
const viewPermissions = ['ui-agreements.agreements.view'];

describe('Agreement search and filter', () => {
  before(() => {
    cy.createUserWithInternalPermissions(viewPermissions).then(user => {
      Cypress.env('testUser', user);
    });

    cy.createAgreementViaApi({ agreement });
    cy.getAdminToken();
    AgreementsSettingsInteractor.fetchStatusLabel(agreement);
  });

  after(() => {
    cy.deleteAgreementViaApi({ agreementId: agreement.id });
    cy.deleteUserViaApi(Cypress.env('testUser').id);
  });

  describe('View user actions', () => {
    before(() => {
      cy.login(Cypress.env('testUser').username, Cypress.env('testUser').password);
    });

    after(() => {
      cy.logout();
    });

    describe('Search agreement', () => {
      it('should see Agreements Search & filter', () => {
        AppInteractor.openAgreementsApp();
        AppInteractor.filterPanePresent('agreements-tab-filter-pane');
      });

      it('should search for agreement and see agreement in results list', () => {
        AppInteractor.resetFilter('agreementStatus');
        AppInteractor.searchAgreement(agreement.name);
        AppInteractor.agreementVisible(agreement.name);
      });

      it('should check "Description" and "Alternative name" and do not see agreement in results list', () => {
        AppInteractor.clickCheckbox('Alternative name');
        AppInteractor.clickCheckbox('Description');
        AppInteractor.agreementNotVisible(agreement.name);
      });

      it('should check "Name" and see agreement in results list again', () => {
        AppInteractor.clickCheckbox('Name');
        AppInteractor.agreementVisible(agreement.name);
      });
    });

    describe('Status filter', () => {
      it('should check other status filter and do not see agreement in results list', () => {
        AgreementsSettingsInteractor.fetchOtherStatusLabel(agreement.status);
        cy.get('@otherStatusLabel').then((otherStatusLabel) => {
          AppInteractor.clickCheckbox(otherStatusLabel);
        });
        AppInteractor.agreementNotVisible(agreement.name);
      });

      it(`should check "${agreement.status}" status filter and see agreement in results list again`, () => {
        AppInteractor.clickCheckbox(agreement.status);
        AppInteractor.agreementVisible(agreement.name);
      });
    });

    describe('Start date filter', () => {
      it('should set "On or after" filter after agreements start date and do not see agreement in results list', () => {
        AppInteractor.clickFilterAccordion('Start date');
        AppInteractor.setDateFilter('On or after', DateTools.getDateAfter(agreement.startDate));
        AppInteractor.agreementNotVisible(agreement.name);
      });

      it('should set "On or after" filter before agreements start date and see agreement in results list', () => {
        AppInteractor.setDateFilter('On or after', DateTools.getDateBefore(agreement.startDate));
        AppInteractor.agreementVisible(agreement.name);
      });

      it('should set "On or before" filter before agreements start date and do not see agreement in results list', () => {
        AppInteractor.setDateFilter('On or before', DateTools.getDateBefore(agreement.startDate));
        AppInteractor.agreementNotVisible(agreement.name);
      });

      it('should set "On or before" filter after agreements start date and see agreement in results list', () => {
        AppInteractor.setDateFilter('On or before', DateTools.getDateAfter(agreement.startDate));
        AppInteractor.agreementVisible(agreement.name);
      });
    });
  });
});

