const { defineConfig } = require('cypress');
const setupNodeEvents = require('./setupNodeEvents');

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
    setupNodeEvents,
    baseUrl: 'http://localhost:3000',
    testIsolation: false
  },
});
