import {
  Heading,
  including,
} from '../../interactors';

before(() => {
  cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
});

after(() => {
  cy.logout();
});

describe('Locale settings', () => {
  it('visiting locale settings renders the correct page', () => {
    cy.visit('/settings/tenant-settings/locale');
    cy.expect(Heading(including('Language and localization')).exists());
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
