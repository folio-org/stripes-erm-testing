import { setInteractorTimeout } from '@interactors/globals';

// adding of methods do and expect
import '@interactors/with-cypress';
import 'cypress-file-upload';
import 'cypress-wait-until';

setInteractorTimeout(100_000);

// Direct paths are icky but stripes-testing was never meant to be a library
// Possibly better to copy logic if this fails
require('@folio/stripes-testing/cypress/support/tenant');

require('./api'); // I have NO idea why but these need to be require not import
require('@folio/stripes-testing/cypress/support/stripes');
require('@folio/stripes-testing/cypress/support/users');
require('@folio/stripes-testing/cypress/support/login');
require('./cypressUtilityFunctions');

require('cypress-downloadfile/lib/downloadFileCommand');
require('cypress-xpath');
require('cypress-grep')();

// try to fix the issue with cached location in cypress
Cypress.on('window:before:load', window => {
  Object.defineProperty(window.navigator, 'language', { value: 'en' });
});

const defaultTestLanguage = 'en-US';
const defaultTestTimezone = 'UTC';

beforeEach(() => {
  cy.intercept('POST', '/authn/refresh').as('/authn/refresh');
});

before(() => {
  // This is running before all tests, make sure logged in as admin
  cy.getAdminToken();
  cy.getLocaleSettings().then(body => {
    if (Object.keys(body).length > 0) {
      const localeSettingsId = body.id;
      const localeSettingsValue = body.value;
      Cypress.env('localeSettingsId', body.value);
      Cypress.env('localeSettingsValue', body.value);

      const localeValue = localeSettingsValue.locale;
      const timezoneValue = localeSettingsValue.timezone;

      if (localeValue !== defaultTestLanguage || timezoneValue !== defaultTestTimezone) {
        const updatedValue = {
          ...localeSettingsValue,
          locale: defaultTestLanguage,
          timezone: defaultTestTimezone,
        };

        cy.putLocaleSettings(localeSettingsId, updatedValue);
      }
    }
  });
});

after(() => {
  const localeValue = Cypress.env('localeSettingsValue').locale;
  const timezoneValue = Cypress.env('localeSettingsValue').timezone;

  if ((localeValue && localeValue !== defaultTestLanguage) ||
    (timezoneValue && timezoneValue !== defaultTestTimezone)) {
    // This is running after all tests, make sure logged in as admin (test should have logged user out)
    cy.getAdminToken();
    cy.putLocaleSettings(Cypress.env('localeSettingsId'), Cypress.env('localeSettingsValue'));
  }
});
