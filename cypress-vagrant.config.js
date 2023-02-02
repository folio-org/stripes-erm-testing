const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,
  defaultCommandTimeout: 101000,
  pageLoadTimeout: 120000,
  env: {
    OKAPI_HOST: 'http://localhost:9130',
    OKAPI_TENANT: 'diku',
    login_username: 'diku_admin',
    login_password: 'admin',
    downloadTimeout: 1000,
    allure: 'true',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
