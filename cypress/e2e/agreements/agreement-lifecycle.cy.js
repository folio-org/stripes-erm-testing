import DateTools from '../../support/utils/dateTools';

import AppInteractor from '../../support/fragments/agreements/AppInteractor';
import AgreementFormInteractor from '../../support/fragments/agreements/AgreementFormInteractor';
import AgreementViewInteractor from '../../support/fragments/agreements/AgreementViewInteractor';
import AgreementsSettingsInteractor from '../../support/fragments/agreements/AgreementsSettingsInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

describe('Agreement lifecycle', () => {
  const agreementName = 'Test: ' + generateItemBarcode();
  const agreementName2 = 'lifecycle test: ' + generateItemBarcode();
  const agreement = {
    name: agreementName,
    status: 'Active',
    startDate: DateTools.getCurrentDate()
  };

  before(() => {
    cy.getAdminToken();
    AgreementsSettingsInteractor.fetchStatusLabel(agreement);

    cy.login(Cypress.env('diku_login'), Cypress.env('diku_password'));
  });

  it('should be possible to fill in the "Create agreement" form and submit it', () => {
    cy.visit('/erm/agreements');
    // createAgreement is set in appInteractor and will bootstrap a basic agreement
    AppInteractor.createAgreement(agreement);

    AgreementViewInteractor.paneExists(agreementName);
  });

  it('should be possible to edit the agreement', () => {
    AgreementViewInteractor.paneExists(agreementName);
    AgreementViewInteractor.edit(agreementName);

    AgreementFormInteractor.waitLoading();
    AgreementFormInteractor.fillName(agreementName2);
    AgreementFormInteractor.save();

    AgreementViewInteractor.paneExists(agreementName2);
  });

  it('should be possible to delete the agreement', () => {
    AgreementViewInteractor.paneExists(agreementName2);
    AgreementViewInteractor.delete(agreementName2);
    AgreementViewInteractor.paneDoesNotExist(agreementName2);

    // Check it also no longer shows in the MCL
    AppInteractor.searchAgreement(agreementName2);
    AppInteractor.agreementNotVisible(agreementName2);
  });
});
