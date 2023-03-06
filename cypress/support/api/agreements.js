Cypress.Commands.add('getAgreements', (searchParams) => {
  cy
    .okapiRequest({
      path: 'erm/sas',
      searchParams,
      isDefaultSearchParamsRequired: false,
    })
    .then(({ body }) => {
      Cypress.env('agreements', body);
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

Cypress.Commands.add('getRefdataValues', (desc, searchParams) => {
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

