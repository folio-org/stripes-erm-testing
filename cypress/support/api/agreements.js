import { normalize } from '../utils/stringTools';
import DateTools from '../utils/dateTools';

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

Cypress.Commands.add('getAgreement', (id, searchParams) => {
  cy
    .okapiRequest({
      path: `erm/sas/${id}`,
      searchParams,
      isDefaultSearchParamsRequired: false,
    })
    .then(({ body }) => {
      Cypress.env('agreement', body);
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

Cypress.Commands.add('getFirstAgreementsRefdataLabel', (desc, searchParams) => {
  const descPath = desc.split('.').join('/');
  cy.okapiRequest({
    path: `erm/refdata/${descPath}`,
    searchParams,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    return response.body[0].label;
  });
});

Cypress.Commands.add('getAgreementsRefdataLabelFromValue', (desc, value) => {
  const descPath = desc.split('.').join('/');
  cy.okapiRequest({
    path: `erm/refdata/${descPath}`,
    isDefaultSearchParamsRequired: false,
  }).then((response) => {
    // return label which has value
    return response.body.find((item) => item.value === value).label;
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

Cypress.Commands.add('createAgreementViaApi', (agreement) => {
  const agreementStatus = agreement.status ? normalize(agreement.status) : 'active';
  const startDate = agreement.startDate ? DateTools.getApiDate(agreement.startDate) : DateTools.getApiDate();
  cy.okapiRequest({
    method: 'POST',
    path: 'erm/sas',
    body: {
      agreementStatus,
      name: agreement.name,
      periods: [{ startDate }]
    },
    isDefaultSearchParamsRequired: false
  })
    .then(response => {
      agreement.id = response.body.id;
      cy.wrap(agreement).as('agreement');
    });
  return cy.get('@agreement');
});

Cypress.Commands.add('deleteAgreementViaApi', (agreementId) => {
  cy.okapiRequest({
    method: 'DELETE',
    path: `erm/sas/${agreementId}`,
    isDefaultSearchParamsRequired: false
  });
});

Cypress.Commands.add('deleteAgreementLineViaApi', (agreementId, agreementLineId) => {
  cy.okapiRequest({
    method: 'PUT',
    path: `erm/sas/${agreementId}`,
    body: {
      items: [
        {
          'id': agreementLineId,
          '_delete': true
        }
      ]
    },
    isDefaultSearchParamsRequired: false
  });
});
