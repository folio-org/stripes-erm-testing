Cypress.Commands.add('getLocaleSettings', () => {
  cy
    .okapiRequest({
      method: 'GET',
      path: 'settings/entries?query=(scope==stripes-core.prefs.manage%20and%20key==tenantLocaleSettings)',
      isDefaultSearchParamsRequired: false
    })
    .then(({ body }) => {
      return body?.items[0] || {};
    });
});

Cypress.Commands.add('putLocaleSettings', (id, value) => {
  /*
    {
      "id":"63620495-f46c-4048-b0ba-4729a91f79ef",
      "scope":"stripes-core.prefs.manage",
      "key":"tenantLocaleSettings",
      "value":{
        "locale":"en-GB",
        "timezone":"UTC",
        "currency":"USD"
      }
    }
  */
  cy
    .okapiRequest({
      method: 'PUT',
      path: `settings/entries/${id}`,
      body: {
        id: `${id}`,
        scope: 'stripes-core.prefs.manage',
        key: 'tenantLocaleSettings',
        value: `${value}`
      },
      isDefaultSearchParamsRequired: false
    });
});
