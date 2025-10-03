import AppInteractor from '../../support/fragments/agreements/AppInteractor';

describe('Opening agreements', () => {
  before(() => {
    cy.login(Cypress.env('diku_login'), Cypress.env('diku_password'));
  });

  it('visiting agreements renders the correct page', () => {
    // This already has assertions that it has opened the correct app, use those
    AppInteractor.openAgreementsApp();
    AppInteractor.waitLoading();
  });
});
