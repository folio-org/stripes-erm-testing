import { setInteractorTimeout } from '@interactors/globals';

// adding of methods do and expect
import '@interactors/with-cypress';

import './stripes';

import './api';

import './login';
import './users';
import 'cypress-file-upload';
import './commands';

setInteractorTimeout(100_000);

require('cypress-xpath');
require('cypress-grep')();
require('@shelex/cypress-allure-plugin');

// try to fix the issue with cached location in cypress
Cypress.on('window:before:load', window => {
  Object.defineProperty(window.navigator, 'language', { value: 'en' });
});
