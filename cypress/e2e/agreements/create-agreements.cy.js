import {
  Pane,
  including,
} from '@folio/stripes-testing';

import DateTools from '../../support/utils/dateTools';

import { createAgreement } from '../../support/fragments/agreements/AppInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

describe('Create agreements', () => {
  const agreementName = 'Test123' + generateItemBarcode();

  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  it('should be possible by filling the "Create agreement" form and submitting it', function () {
    cy.visit('/erm/agreements');
    // createAgreement is set in appInteractor and will bootstrap a basic agreement
    createAgreement({
      name: agreementName,
      status: 'Active',
      startDate: DateTools.getCurrentDate()
    });
    cy.expect(Pane(including(agreementName)).is({ visible: true, index: 2 }));
  });
});
