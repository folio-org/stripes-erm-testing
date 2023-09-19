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
let localeSettingsId;
let localeSettingsValue;
before(() => {
  cy.getAdminToken();
  cy.getLocaleSettings().then(body => {
    if (Object.keys(body).length > 0) {
      localeSettingsId = body.id;
      localeSettingsValue = body.value;
      const localeValue = localeSettingsValue.match(/"locale":"(.*?)"/);
      if (localeValue) {
        const extractedLocale = localeValue[1];
        Cypress.env('localeValue', extractedLocale);
        if (extractedLocale !== defaultTestLanguage) {
          const updatedValue = localeSettingsValue.replace(`"locale":"${extractedLocale}"`, `"locale":"${defaultTestLanguage}"`);
          cy.putLocaleSettings(localeSettingsId, updatedValue);
        }
      }
    }
  });
});

after(() => {
  if (Cypress.env('localeValue') && Cypress.env('localeValue') !== defaultTestLanguage) {
    cy.getAdminToken();
    cy.putLocaleSettings(localeSettingsId, localeSettingsValue);
  }
});
