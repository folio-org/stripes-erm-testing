
describe('Locale settings', () => {
  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
  });

  after(() => {
    cy.logout();
  });

  it('visiting locale settings renders the correct page', () => {
    cy.visit('/settings/tenant-settings/locale');
  });

  it('should have the expected locale en-US', () => {
    cy.get('#select-locale select')
      .should('have.value', 'en-US');
  });

  it('should have the expected timezone UTC', () => {
    cy.get('#select-timezone select')
      .should('have.value', 'UTC');
  });
});
