import HomeInteractor from '../../support/fragments/HomeInteractor';
import AppInteractor from '../../support/fragments/licenses/AppInteractor';

describe('Opening licenses', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
    // cy.viewport(550, 750);
  });

  it('locate and select license app in navbar', () => {
    HomeInteractor.navToApp('Licenses');
    AppInteractor.waitLoading();
  });
});
