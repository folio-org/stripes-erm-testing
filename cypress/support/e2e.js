import { setInteractorTimeout } from '@interactors/globals';

// adding of methods do and expect
import '@interactors/with-cypress';
import 'cypress-file-upload';

setInteractorTimeout(100_000);
require('./api'); // I have NO idea why but these need to be require not import
require('./stripes');
require('./users');
require('./login');

require('cypress-downloadfile/lib/downloadFileCommand');
require('cypress-xpath');
require('cypress-grep')();

// try to fix the issue with cached location in cypress
Cypress.on('window:before:load', window => {
  Object.defineProperty(window.navigator, 'language', { value: 'en' });
});
