// Direct paths are icky but stripes-testing was never meant to be a library
// Possibly better to copy logic if this fails -- see e2e.js
import Tenant from '@folio/stripes-testing/cypress/support/tenant';

// We could create an equivalent okapiKiwtRequest or such with defaults for KIWT modules, but this is so far unnecessary
const DEFAULT_SEARCH_PARAMS = {
  limit: 1000,
  query: 'cql.allRecords=1',
};

Cypress.Commands.add('okapiRequest', ({
  method = 'GET',
  path,
  searchParams = {},
  body,
  // This is NOT default for ERM, so we turn this off for all erm requests.
  isDefaultSearchParamsRequired = false,
  headers = {} // Any extra headers
}) => {
  const initialParams = new URLSearchParams({ ...searchParams });
  const cypressEnvPath = `${Cypress.env('OKAPI_HOST')}/${path}`;

  if (isDefaultSearchParamsRequired) {
    Object.entries(DEFAULT_SEARCH_PARAMS).forEach(([key, value]) => initialParams.append(key, value));
  }

  const queryString = (initialParams).toString();
  cy.request({
    method,
    url: queryString ? `${cypressEnvPath}?${queryString}` : cypressEnvPath,
    headers: {
      'x-okapi-tenant': Tenant.get(),
      // 'x-okapi-token': Cypress.env('token')
      ...headers
    },
    body,
  });
});
