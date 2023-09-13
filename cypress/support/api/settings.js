Cypress.Commands.add('getLocaleSettings', () => {
  cy
    .okapiRequest({
      method: 'GET',
      path: 'configurations/entries?query=(module==ORG%20and%20configName==localeSettings)',
    })
    .then(({ body }) => {
      return body.configs[0];
    });
});

Cypress.Commands.add('putLocaleSettings', (id, value) => {
  /*   {
      "id": "fa5eae21-633b-4a6c-aff7-b4c11859d5b7",
      "module": "ORG",
      "configName": "localeSettings",
      "enabled": true,
      "value": "{\"locale\":\"de-DE\",\"timezone\":\"UTC\",\"currency\":\"USD\"}"
  } */
  cy
    .okapiRequest({
      method: 'PUT',
      path: `configurations/entries/${id}`,
      body: {
        id: `${id}`,
        module: 'ORG',
        configName: 'localeSettings',
        enabled: true,
        value: `${value}`
      },
    });
});
