import {
  KeyValue,
} from '@folio/stripes-testing';

import { HeadlineInteractor as Headline } from '../../../interactors';

import DateTools from '../../support/utils/dateTools';

import AppInteractor from '../../support/fragments/licenses/AppInteractor';
import LicenseFormInteractor from '../../support/fragments/licenses/LicenseFormInteractor';
import LicenseViewInteractor from '../../support/fragments/licenses/LicenseViewInteractor';
import LicensesSettingsInteractor from '../../support/fragments/licenses/LicensesSettingsInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';
import HomeInteractor from '../../support/fragments/HomeInteractor';

describe('License lifecycle', () => {
  const licenseName = 'Test: ' + generateItemBarcode();
  const licenseName2 = 'lifecycle test: ' + generateItemBarcode();
  const refdataTypeDesc = 'License.Type';

  const license = {
    name: licenseName,
    status: 'Active',
    startDate: DateTools.getCurrentDate(),
    type: 'Local'
  };

  let typeCreated = false;

  before(() => {
    cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
    cy.getAdminToken();
    cy.getLicensesRefdataValues(refdataTypeDesc).then((refdata) => {
      /*
       * FIXME for now we will use refdata label
       *
       * Long term I'm not 100% sure what we should do here, as we test based on labels, but
       * labels can and will change in a running system, leading to potentially flaky tests
       * in edge cases. Hopefully we won't hit those, but food for thought.
       *
       * Potential failure case - label has been changed, so "Active" no longer exists, but
       * instead we have { value: 'active', label: "Wibble" }. At this point we try to create
       * { value: 'active', label: "Active" }, but hit clashing value so no creation and test
       * fails.
       *
       * See also comment in LicensesSettingsInteractor
       */
      if (refdata.every(obj => obj.label !== license.type)) {
        LicensesSettingsInteractor.createLicensesRefdataValue(refdataTypeDesc, license.type);
        typeCreated = true;
      }
    });

    AppInteractor.fetchStatusLabel(license);
  });

  after(() => {
    if (typeCreated === true) {
      LicensesSettingsInteractor.deleteLicensesRefdataValue(refdataTypeDesc, license.type);
    }
  });

  describe('open licenses app', () => {
    it('should locate and select license app in navbar', () => {
      HomeInteractor.navToApp('Licenses');
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
      cy.getIdFromURL().then(licenseId => {
        cy.getLicense(licenseId).its('dateCreated').as('dateCreated');
      });
    });

    // it has to be 'function ()' and NOT '() =>' because otherwise the alias can't be accessed with this.*
    it('should be possible to open and view licenseInfoRecordMetaContent', function () {
      LicenseViewInteractor.recordMetadataInfo(this.dateCreated);
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
      LicenseViewInteractor.recordMetadataInfoUpdated(this.dateCreated);
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
