// This is NOT default for ERM, so we create our own version with default turned off
const DEFAULT_SEARCH_PARAMS = {
  limit: 1000,
  query: 'cql.allRecords=1',
};

Cypress.Commands.add('okapiRequest', ({
  method = 'GET',
  path,
  searchParams = {},
  body,
  isDefaultSearchParamsRequired = false,
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
      'x-okapi-tenant': Cypress.env('OKAPI_TENANT'),
      'x-okapi-token': Cypress.env('token'),
    },
    body,
  });
});