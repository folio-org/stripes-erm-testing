import {
  KeyValue,
} from '@folio/stripes-testing';

import { AppListInteractor as AppList, HeadlineInteractor as Headline } from '../../../interactors';

import DateTools from '../../support/utils/dateTools';

import AppInteractor from '../../support/fragments/licenses/AppInteractor';
import LicenseFormInteractor from '../../support/fragments/licenses/LicenseFormInteractor';
import LicenseViewInteractor from '../../support/fragments/licenses/LicenseViewInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

describe('License lifecycle', () => {
  const licenseName = 'Test: ' + generateItemBarcode();
  const licenseName2 = 'lifecycle test: ' + generateItemBarcode();

  const license = {
    name: licenseName,
    status: 'Active',
    startDate: DateTools.getCurrentDate(),
    type: 'Local'
  };

  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
  });

  describe('open licenses app', () => {
    it('should locate and select license app in navbar', () => {
      cy.do(AppList().navTo('Licenses'));
      AppInteractor.waitLoading();
    });
  });

  describe('creating license', () => {
    it('should be possible to fill in the "Create license" form and submit it', () => {
      AppInteractor.createLicense(license);
    });

    it('should be possible to view the license with correct details', () => {
      LicenseViewInteractor.paneExists(license.name);
      cy.expect(KeyValue('Type').has({ value: license.type }));
      cy.expect(KeyValue('Status').has({ value: license.status }));
      cy.expect(KeyValue('Start date').has({ value: DateTools.getDateNoZeros(license.startDate) }));
      cy.expect(Headline(license.name).exists());
    });
  });

  describe('manipulating license', () => {
    before(() => {
      LicenseViewInteractor.paneExists(license.name);
      cy.url().then(($url) => {
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const licenseId = $url.match(regex)[0];
        cy.getLicense(licenseId).its('dateCreated').as('dateCreated');
      });
    });

    // it has to be 'function ()' and NOT '() =>' because otherwise the alias can't be accessed with this.*
    it('should be possible to open and view licenseInfoRecordMetaContent', function () {
      cy.get('[id=licenseInfoRecordMeta]').click().within(() => {
        cy.contains('Record created: ' + DateTools.getFormattedDateWithTime(this.dateCreated));
        cy.contains('Record last updated: ' + DateTools.getFormattedDateWithTime(this.dateCreated));
      });
    });

    it('should wait 60 seconds between create and edit', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(60000);
    });

    it('should be possible to edit the license', () => {
      LicenseViewInteractor.paneExists(licenseName);
      LicenseViewInteractor.edit(license.name);
      LicenseFormInteractor.waitLoading();
      LicenseFormInteractor.fillName(licenseName2);
      LicenseFormInteractor.save();
      LicenseViewInteractor.paneExists(licenseName2);
    });

    it('should be possible to view that the licenseInfoMetaRecord is updated', function () {
      cy.get('[id=licenseInfoRecordMeta]').should('not.have.text', 'Record last updated: ' + DateTools.getFormattedDateWithTime(this.dateCreated));
    });
  });

  describe('deleting license', () => {
    it('should be possible to delete the license', () => {
      LicenseViewInteractor.paneExists(licenseName2);
      LicenseViewInteractor.delete(licenseName2);
      LicenseViewInteractor.paneDoesNotExist(licenseName2);

      // Check it also no longer shows in the MCL
      AppInteractor.searchLicense(licenseName2);
      AppInteractor.licenseNotVisible(licenseName2);
    });
  });
});
