const { defineConfig } = require('cypress');
const setupNodeEvents = require('./setupNodeEvents');

/* For use with a fully running rancher-desktop system */
module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,
  defaultCommandTimeout: 101000,
  pageLoadTimeout: 120000,
  env: {
    OKAPI_HOST: 'http://localhost:30100',
    OKAPI_TENANT: 'test1',
    login_username: 'admin', // Not diku, but that's the name chosen in stripes-testing -.-
    login_password: 'adminpass',
    downloadTimeout: 1000,
    allure: 'true',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    setupNodeEvents,
    baseUrl: 'http://localhost:3000',
    testIsolation: false
  },
});
