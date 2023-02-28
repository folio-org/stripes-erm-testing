import AppInteractor from '../../support/fragments/licenses/AppInteractor';

describe('Opening licenses', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
    // cy.viewport(550, 750);
  });

  it('locate and select license app in navbar', () => {
    // eslint-disable-next-line cypress/no-force
    cy.get('[id=app-list-item-clickable-licenses-module]').click({ force: true });
    AppInteractor.waitLoading();
  });
});



