
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const config = require('@folio/jest-config-stripes');

/* Default config defines some esModules,
 * we overwrite here entirely because it is negative regex
 * In case of failure, check modules included in default config here:
 * https://github.com/folio-org/jest-config-stripes/blob/main/index.js
 */
const extraESModules = ['@folio', 'ky', '@k-int'].join('|');

module.exports = {
  ...config,
  transformIgnorePatterns: [
    `/node_modules/(?!${extraESModules})`
  ],
  moduleNameMapper: {
    '^.+\\.(css)$': path.join(__dirname, './jest/mocks/styleMock.js'),
    /* config.moduleNameMapper needs to be at end, since regex keys here are
     * applied top to bottom, so any overwriting behaviour
     * we want specifically needs to happen _first_.
     */
    ...(config.moduleNameMapper ?? {}),
  },
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './jest/jest.setup.js'),
  ],
  resolver: path.join(__dirname, './jest/resolver.js'),
};
