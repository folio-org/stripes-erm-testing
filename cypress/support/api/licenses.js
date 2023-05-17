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

Cypress.Commands.add('getLicense', (id, searchParams) => {
  cy
    .okapiRequest({
      path: `licenses/licenses/${id}`,
      searchParams,
      isDefaultSearchParamsRequired: false,
    })
    .then(({ body }) => {
      Cypress.env('license', body);
      return body;
    });
});

Cypress.Commands.add('getLicensesRefdata', (searchParams) => {
  cy.okapiRequest({
    path: 'licenses/refdata',
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    Cypress.env('refdata', response.body);
    return response.body;
  });
});

Cypress.Commands.add('getLicensesRefdataValues', (desc, searchParams) => {
  const descPath = desc.split('.').join('/');
  cy.okapiRequest({
    path: `licenses/refdata/${descPath}`,
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    Cypress.env(desc, response.body);
    return response.body;
  });
});

Cypress.Commands.add('getFirstLicensesRefdataLabel', (desc, searchParams) => {
  const descPath = desc.split('.').join('/');
  cy.okapiRequest({
    path: `licenses/refdata/${descPath}`,
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    return response.body[0].label;
  });
});

