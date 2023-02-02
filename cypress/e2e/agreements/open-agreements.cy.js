import agreements from '../../support/fragments/agreements/agreements';

describe('Opening agreements', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('visiting agreements renders the correct page', () => {
    cy.visit('/erm/agreements');
    agreements.waitLoading();
  });
});
