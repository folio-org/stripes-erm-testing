Cypress.Commands.add('getLicenses', (searchParams) => {
  cy
    .okapiRequest({
      path: 'licenses/licenses',
      searchParams,
      isDefaultSearchParamsRequired: false,
    })
    .then(({ body }) => {
      Cypress.env('licenses', body);
      return body;
    });
});

Cypress.Commands.add('getRefdata', (searchParams) => {
  cy.okapiRequest({
    path: 'erm/refdata',
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    Cypress.env('refdata', response.body);
    return response.body;
  });
});

Cypress.Commands.add('getRefdataValues', (searchParams, desc) => {
  const descPath = desc.split('.').join('/');
  cy.okapiRequest({
    path: `erm/refdata/${descPath}`,
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    Cypress.env(desc, response.body);
    return response.body;
  });
});

