const { defineConfig } = require('cypress');

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
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      return require('./cypress/plugins/index')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    testIsolation: false
  },
});
