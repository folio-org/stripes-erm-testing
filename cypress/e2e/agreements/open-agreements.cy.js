import HomeInteractor from '../../support/fragments/HomeInteractor';
import AppInteractor from '../../support/fragments/licenses/AppInteractor';

describe('Opening agreements', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('visiting agreements renders the correct page', () => {
    HomeInteractor.navToApp('Agreements');
    AppInteractor.waitLoading();
  });
});
