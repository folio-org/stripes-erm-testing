
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const config = require('@folio/jest-config-stripes');

const esModules = ['@folio', 'ky', '@k-int'].join('|');

module.exports = {
  ...config,
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './jest/jest.setup.js'),
  ],
  resolver: path.join(__dirname, './jest/resolver.js'),
};
