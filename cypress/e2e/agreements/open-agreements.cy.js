import AppInteractor from '../../support/fragments/agreements/AppInteractor';

describe('Opening agreements', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('visiting agreements renders the correct page', () => {
    cy.visit('/erm/agreements');
    AppInteractor.waitLoading();
  });
});
