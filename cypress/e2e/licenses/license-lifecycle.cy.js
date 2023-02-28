import {
  Button,
  Dropdown,
  DropdownMenu,
  including,
  KeyValue,
  Modal,
  Pane,
  Select,
  TextField
} from '@folio/stripes-testing';

import { DatepickerInteractor as Datepicker, HeadlineInteractor as Headline } from '../../../interactors';

import DateTools from '../../support/utils/dateTools';
import { normalize } from '../../support/utils/stringTools';

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

  it('locate and select license app in navbar', () => {
    // eslint-disable-next-line cypress/no-force
    cy.get('[id=app-list-item-clickable-licenses-module]').click({ force: true });
    AppInteractor.waitLoading();
  });

  it('should be possible to fill in the "Create license" form and submit it', () => {
    cy.do([
      Dropdown('Actions').open(),
      DropdownMenu().find(Button('New')).click()
    ]);
    LicenseFormInteractor.waitLoading();
    LicenseFormInteractor.fill(license);
    LicenseFormInteractor.save();
    // cy.expect(TextField('Name*').exists());

    // cy.do(Select({ id: 'edit-license-type' }).choose(license.type));
    // cy.expect(Select({ id: 'edit-license-type' }).has({ value: normalize(license.type) }));

    // cy.do(Select({ id: 'edit-license-status' }).choose(license.status));
    // cy.expect(Select({ id: 'edit-license-status' }).has({ value: normalize(license.status) }));

    // cy.do(Datepicker({ id: 'edit-license-start-date' }).fillIn(license.startDate));
    // cy.expect(Datepicker({ id: 'edit-license-start-date' }).has({ inputValue: license.startDate }));

    // cy.do(TextField({ id: 'edit-license-name' }).fillIn(license.name));
    // cy.expect(TextField({ id: 'edit-license-name' }).has({ value: license.name }));

    // cy.do(Button('Save & close').click());
  });

  const createdDate = DateTools.getFormattedDateWithTime();
  const updatedDate = createdDate;
  console.log('creatdDate %o', createdDate);

  it('should be possible to view the license with correct details', () => {
    LicenseViewInteractor.paneExists(license.name);
    cy.get('[id=pane-view-license]').click().within(() => {
      cy.expect(KeyValue('Type').has({ value: license.type }));
      cy.expect(KeyValue('Status').has({ value: license.status }));
      cy.expect(KeyValue('Start date').has({ value: DateTools.getDateNoZeros(license.startDate) }));
      cy.expect(Headline(license.name).exists());
    });
  });

  it('should be possible to open and view licenseInfoRecordMetaContent', () => {
    cy.get('[id=licenseInfoRecordMeta]').click().within(() => {
      cy.contains('Record created: ' + createdDate);
      cy.contains('Record last updated: ' + updatedDate);
    });
  });

  // it('should be possible to edit the license', () => {
  //   LicenseViewInteractor.paneExists(licenseName);
  //   // cy.do(Pane(including(licenseName)).focus);
  //   LicenseViewInteractor.edit();

  //   LicenseFormInteractor.waitLoading();
  //   LicenseFormInteractor.fillName(licenseName2);
  //   LicenseFormInteractor.save();

  //   LicenseViewInteractor.paneExists(licenseName2);
  // });

  // it('should be possible to delete the license', () => {
  //   LicenseViewInteractor.paneExists(licenseName);
  // cy.get('[id=view-license-action]').click({ force: true }).within(() => {
  // cy.do([
  //   Dropdown('Actions').open(),
  //   DropdownMenu().find(Button('Delete')).click()
  // ]);
  // });
  //    cy.get('[id=view-license-action]').within(() => {
  //      cy.do([
  //        Dropdown('Actions').open(),
  //        DropdownMenu().find(Button('Delete')).click()
  //      ]);
  //    });
  // cy.do(DropdownMenu().find(Button('Delete'))).click();
  // cy.get('#pane-view-license').do([
  //   Dropdown('Actions').open(),
  //   DropdownMenu().find(Button('Delete')).click()
  // ]);
  // cy.expect(Modal('Delete license').exists());
  // cy.do(Button('Delete').click());
  // LicenseViewInteractor.delete();
  // LicenseViewInteractor.paneDoesNotExist(licenseName);

  // Check it also no longer shows in the MCL
  // AppInteractor.searchLicense(licenseName2);
  // AppInteractor.licenseNotVisible(licenseName2);
  // });
});
