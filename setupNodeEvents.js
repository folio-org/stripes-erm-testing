// setupNodeEvents.js

const setupPlugins = require('./cypress/plugins/index');

function setupNodeEvents(on, config) {
  const updatedConfig = setupPlugins(on, config);
  // Check for and remove the cypress-cloud plugin if necessary
  if (updatedConfig.plugins && updatedConfig.plugins.includes('cloudPlugin')) {
    updatedConfig.plugins = updatedConfig.plugins.filter(plugin => plugin !== 'cloudPlugin');
  }

  return updatedConfig;
}

module.exports = setupNodeEvents;
