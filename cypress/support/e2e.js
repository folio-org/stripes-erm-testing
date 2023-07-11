import { setInteractorTimeout } from '@interactors/globals';

// adding of methods do and expect
import '@interactors/with-cypress';
import 'cypress-file-upload';
import 'cypress-wait-until';

setInteractorTimeout(100_000);
require('./api'); // I have NO idea why but these need to be require not import
require('./stripes');
require('./users');
require('./login');
require('./cypressUtilityFunctions');

require('cypress-downloadfile/lib/downloadFileCommand');
require('cypress-xpath');
require('cypress-grep')();

// try to fix the issue with cached location in cypress
Cypress.on('window:before:load', window => {
  Object.defineProperty(window.navigator, 'language', { value: 'en' });
});

const defaultTestLanguage = 'en-US';
before(() => {
  cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
  cy.getAdminToken();
  cy.visit('/settings/tenant-settings/locale');
  cy.get('select#locale').invoke('val').then((selectedValue) => {
    Cypress.env('localeValue', selectedValue);
    if (selectedValue !== defaultTestLanguage) {
      cy.get('select#locale').select(defaultTestLanguage);
      cy.get('button[type="submit"]').click();
    }
  });

  cy.logout();
});

after(() => {
  cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
  cy.getAdminToken();
  cy.visit('/settings/tenant-settings/locale');
  cy.get('select#locale').invoke('val').then((selectedValue) => {
    if (selectedValue !== Cypress.env('localeValue')) {
      cy.get('select#locale').select(Cypress.env('localeValue'));
      cy.get('button[type="submit"]').click();
    }
  });
  cy.logout();
});
