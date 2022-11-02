
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const esModules = ['@folio', 'ky', '@k-int'].join('|');

module.exports = {
  collectCoverageFrom: [
    '**/(lib|src)/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
  coverageDirectory: './artifacts/coverage-jest/',
  coverageReporters: ['lcov'],
  reporters: ['jest-junit', 'default'],
  transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './jest/jest-transformer.js') },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css)$': path.join(__dirname, './jest/mocks/styleMock.js'),
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [path.join(__dirname, './jest/jest.setup.js')],
  resolver: path.join(__dirname, './jest/resolver.js'),
};
