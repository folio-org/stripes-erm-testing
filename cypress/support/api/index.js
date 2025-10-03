require('@folio/stripes-testing/cypress/support/api'); // Use what's set up by stripes-testing

require('./agreements'); // I have NO idea why but these need to be require not import
require('./licenses');
require('./locale-settings');
require('./users-enhanced');
