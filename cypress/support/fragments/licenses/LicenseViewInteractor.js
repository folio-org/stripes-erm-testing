import {
  Button,
  Callout,
  DropdownMenu,
  including,
  Modal,
  Pane
} from '../../../../interactors';

import DateTools from '../../utils/dateTools';
/* The cypressinteractor for the License View pane
 *
 * If we find ourselves doing a certain action on License View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class LicenseViewInteractor {
  static actionsButton = Pane({ id: 'pane-view-license' }).find(Button('Actions'));

  static deleteButton = DropdownMenu().find(Button('Delete'));
  static duplicateButton = DropdownMenu().find(Button('Duplicate'));
  static editButton = DropdownMenu().find(Button('Edit'));

  static deleteModal = Modal('Delete license');
  static deleteCallout = (licenseName) => `Deleted license: ${licenseName}`;
  static deleteModalText = (licenseName) => `License ${licenseName} and any attached amendments will be deleted.`;
  static modalDeleteButton = Button('Delete');
  static modalCancelButton = Button('Cancel');

  static edit(licenseName) {
    cy.do(Pane(including(licenseName)).clickAction('Edit'));
  }

  static delete(licenseName) {
    cy.do(Pane(including(licenseName)).clickAction('Delete'));
    cy.expect(this.deleteModal.exists());
    cy.contains(this.deleteModalText(licenseName));
    cy.expect(this.modalCancelButton.exists());
    cy.expect(this.modalDeleteButton.exists());
    cy.do(this.modalDeleteButton.click());
    cy.expect(Callout(this.deleteCallout(licenseName)).exists());
  }

  static paneExists(licenseName) {
    cy.expect(Pane(including(licenseName)).is({ visible: true, index: 2 }));
  }

  static paneDoesNotExist(licenseName) {
    cy.expect(Pane(including(licenseName)).absent());
  }

  static recordMetadataInfo(dateCreated) {
    cy.get('[id=licenseInfoRecordMeta]').click().within(() => {
      cy.contains('Record created: ' + DateTools.getFormattedDateWithTime(dateCreated));
      cy.contains('Record last updated: ' + DateTools.getFormattedDateWithTime(dateCreated));
    });
  }

  static recordMetadataInfoUpdated(dateCreated) {
    cy.get('[id=licenseInfoRecordMeta]').should('not.have.text', 'Record last updated: ' + DateTools.getFormattedDateWithTime(dateCreated));
  }
}
