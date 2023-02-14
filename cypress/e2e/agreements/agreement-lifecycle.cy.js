import DateTools from '../../support/utils/dateTools';

import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementFormInteractor from '../../support/fragments/agreements/AgreementFormInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

describe('Agreement lifecycle', () => {
  const agreementName = 'Test: ' + generateItemBarcode();

  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('should be possible to fill in the "Create agreement" form and submit it', () => {
    cy.visit('/erm/agreements');
    // createAgreement is set in appInteractor and will bootstrap a basic agreement
    AppInteractor.createAgreement({
      name: agreementName,
      status: 'Active',
      startDate: DateTools.getCurrentDate()
    });

    AgreementViewInteractor.paneExists(agreementName);
  });

  it('should be possible to edit the agreement', () => {
    AgreementViewInteractor.paneExists(agreementName);
    AgreementViewInteractor.edit();

    AgreementFormInteractor.waitLoading();
    AgreementFormInteractor.fillName('lifecycle test');
    AgreementFormInteractor.save();

    AgreementViewInteractor.paneExists('lifecycle test');
  });

  it('should be possible to delete the agreement', () => {
    AgreementViewInteractor.paneExists('lifecycle test');
    AgreementViewInteractor.delete();
    AgreementViewInteractor.paneDoesNotExist('lifecycle test');

    // Check it also no longer shows in the MCL
    AppInteractor.searchAgreement('lifecycle test');
    AppInteractor.agreementNotVisible('lifecycle test');
  });
});
