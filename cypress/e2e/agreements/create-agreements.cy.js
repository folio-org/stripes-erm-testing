import {
  Pane,
  including,
} from '@folio/stripes-testing';

import DateTools from '../../support/utils/dateTools';

import agreements from '../../support/fragments/agreements/agreements';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

describe('Create agreements', () => {
  const agreementName = 'Test123' + generateItemBarcode();

  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('should be possible by filling the "Create agreement" form and submitting it', function () {
    cy.visit('/erm/agreements'); // The "new agreement" created by another team relies on the "New" button being present
    agreements.create({
      name: agreementName,
      status: 'Active',
      startDate: DateTools.getCurrentDate()
    });
    cy.expect(Pane(including(agreementName)).is({ visible: true, index: 2 }));
  });
});
