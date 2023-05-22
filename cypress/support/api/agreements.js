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

Cypress.Commands.add('getAgreementsRefdata', (searchParams) => {
  cy.okapiRequest({
    path: 'erm/refdata',
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    Cypress.env('refdata', response.body);
    return response.body;
  });
});

Cypress.Commands.add('getAgreementsRefdataValues', (desc, searchParams) => {
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

// TODO if we end up needing the same again for another app we should abstract the meat of these to general methods
Cypress.Commands.add('getAgreementsGeneralSettings', () => {
  cy.okapiRequest({
    method: 'GET',
    path: 'configurations/entries?query=(module==AGREEMENTS%20and%20configName==general)',
    isDefaultSearchParamsRequired: false,
  })
    .then((response) => {
      const configs = response.body.configs[0];
      const value = { ...JSON.parse(configs?.value ?? '{}') };
      return value;
    });
});

Cypress.Commands.add('setAgreementsGeneralSettings', (params) => {
  cy.okapiRequest({
    method: 'GET',
    path: 'configurations/entries?query=(module==AGREEMENTS%20and%20configName==general)',
    isDefaultSearchParamsRequired: false,
  })
    .then((response) => {
      const configs = response.body.configs[0];
      const newValue = { ...JSON.parse(configs.value), ...params };
      cy.okapiRequest({
        method: 'PUT',
        path: `configurations/entries/${configs.id}`,
        body: {
          id: configs.id,
          module: configs.module,
          configName: configs.configName,
          enabled: configs.enabled,
          value: JSON.stringify(newValue),
        },
        isDefaultSearchParamsRequired: false,
      });
    });
});
