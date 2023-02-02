const cypressGrep = require('cypress-grep/src/plugin');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  cypressGrep(config);

  on('file:preprocessor', webpackPreprocessor());
  return config;
};
