import { Headline, KeyValue } from '../../../interactors';
import { getRandomPostfix } from '../../support/utils/stringTools';

import AppInteractor from '../../support/fragments/licenses/AppInteractor';
import LicenseViewInteractor from '../../support/fragments/licenses/LicenseViewInteractor';
import LicensesSettingsInteractor from '../../support/fragments/licenses/LicensesSettingsInteractor';

import generateItemBarcode from '../../support/utils/generateItemBarcode';

const licenseName = 'Test: ' + generateItemBarcode();

const license = {
  name: licenseName,
  status: 'Active',
  type: 'Local'
};

const refdataTypeDesc = 'License.Type';

// users
const editUser = {
  username: `editTest${getRandomPostfix()}`,
  password: 'editTest'
};

const editPermissions = ['ui-licenses.licenses.edit'];

const editDeleteUser = {
  username: `editDeleteTest${getRandomPostfix()}`,
  password: 'editDeleteTest'
};

const editDeletePermissions = ['ui-licenses.licenses.delete', 'ui-licenses.licenses.edit'];

const viewUser = {
  username: `viewTest${getRandomPostfix()}`,
  password: 'viewTest'
};

const viewPermissions = ['ui-licenses.licenses.view'];

describe('License create and delete', () => {
  before(() => {
    cy.createUserWithPwAndPerms(editUser, editPermissions);
    cy.createUserWithPwAndPerms(editDeleteUser, editDeletePermissions);
    cy.createUserWithPwAndPerms(viewUser, viewPermissions);

    cy.getAdminToken();
    // the following sets Cypress.env('licenseTypeCreated') to true if a License.Type entry is created
    LicensesSettingsInteractor.ensureLicenseTypeExists(license);
    LicensesSettingsInteractor.fetchStatusLabel(license);
  });

  after(() => {
    if (Cypress.env('licenseTypeCreated') === true) {
      cy.login(Cypress.env('login_username'), Cypress.env('login_password'));
      LicensesSettingsInteractor.deleteLicensesRefdataValue(refdataTypeDesc, license.type);
      cy.logout();
    }

    cy.getAdminToken();
    cy.deleteUserViaApi(editUser.userId);
    cy.deleteUserViaApi(editDeleteUser.userId);
    cy.deleteUserViaApi(viewUser.userId);
  });

  function createLicense() {
    describe('create license', () => {
      it('should open the licenses app and see "Actions" button', () => {
        AppInteractor.openLicensesApp();
        AppInteractor.waitLoading();
      });

      it('should open actions dropdown with export option disabled', () => {
        cy.expect(AppInteractor.actionsButton.exists());
        cy.do(AppInteractor.actionsButton.click()).then(() => {
          cy.expect(AppInteractor.newButton.exists());
          cy.expect(AppInteractor.exportCSVButton.is({ disabled: true }));
        });
        // close dropdown because in next step Actions button will be clicked again
        cy.do(AppInteractor.actionsButton.click());
      });

      it('should create license', () => {
        AppInteractor.createLicense(license);
      });
    });
  }

  function viewLicense() {
    describe('view license', () => {
      before(() => {
        cy.getIdFromURL().then(licenseId => {
          Cypress.env('licenseId', licenseId);
          cy.getLicense(licenseId).its('dateCreated').as('dateCreated');
        });
      });

      it('should see correct license values in view pane', () => {
        LicenseViewInteractor.paneExists(licenseName);
        cy.expect(KeyValue('Status').has({ value: license.status }));
        cy.expect(KeyValue('Type').has({ value: license.type }));
        cy.expect(Headline(licenseName).exists());
      });

      // it has to be 'function ()' and NOT '() =>' because otherwise the alias can't be accessed with this.*
      it('should open "Record last updated" information and see correct values', function () {
        LicenseViewInteractor.recordMetadataInfo(this.dateCreated);
      });
    });
  }

  describe('view user actions', () => {
    before(() => {
      cy.login(viewUser.username, viewUser.password);
      cy.getToken(viewUser.username, viewUser.password);
    });

    after(() => {
      cy.logout();
    });

    it('should open the licenses app and see "Actions" button w/o "New" option', () => {
      AppInteractor.openLicensesApp();
      AppInteractor.waitLoading();
      cy.do(AppInteractor.actionsButton.click()).then(() => {
        cy.expect(AppInteractor.newButton.absent());
        cy.expect(AppInteractor.exportCSVButton.is({ disabled: true }));
      });
    });
  });

  describe('edit user actions', () => {
    before(() => {
      cy.login(editUser.username, editUser.password);
      cy.getToken(editUser.username, editUser.password);
    });

    after(() => {
      cy.logout();

      // delete created license as admin because user has no delete permission
      cy.getAdminToken();
      cy.deleteLicenseViaApi(Cypress.env('licenseId'));
    });

    createLicense();
    viewLicense();

    describe('actions dropdown', () => {
      it('should open actions dropdown w/o delete option', () => {
        cy.do(LicenseViewInteractor.actionsButton(licenseName).click())
          .then(() => {
            cy.expect(LicenseViewInteractor.deleteButton.absent());
            cy.expect(LicenseViewInteractor.duplicateButton.exists());
            cy.expect(LicenseViewInteractor.editButton.exists());
          });
      });
    });
  });

  describe('editDelete user actions', () => {
    before(() => {
      cy.login(editDeleteUser.username, editDeleteUser.password);
      cy.getToken(editDeleteUser.username, editDeleteUser.password);
    });

    after(() => {
      cy.logout();
    });

    createLicense();
    viewLicense();

    describe('delete license', () => {
      it('should open actions dropdown with options', () => {
        cy.do(LicenseViewInteractor.actionsButton(licenseName).click())
          .then(() => {
            cy.expect(LicenseViewInteractor.deleteButton.exists());
            cy.expect(LicenseViewInteractor.duplicateButton.exists());
            cy.expect(LicenseViewInteractor.editButton.exists());
          });
        // close dropdown because in next step Actions button will be clicked again
        cy.do(LicenseViewInteractor.actionsButton(licenseName).click());
      });

      it('should delete the license', () => {
        LicenseViewInteractor.delete(licenseName);
        LicenseViewInteractor.paneDoesNotExist(licenseName);
        // Check it also no longer shows in the MCL
        AppInteractor.searchLicense(licenseName);
        AppInteractor.licenseNotVisible(licenseName);
      });
    });
  });
});
