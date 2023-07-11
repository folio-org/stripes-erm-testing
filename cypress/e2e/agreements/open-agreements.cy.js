import AppInteractor from '../../support/fragments/agreements/AppInteractor';

describe('Opening agreements', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('visiting agreements renders the correct page', () => {
    // This already has assertions that it has opened the correct app, use those
    AppInteractor.openAgreementsApp();
    AppInteractor.waitLoading();
  });
});
