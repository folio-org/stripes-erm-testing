import {
  Button,
  DropdownMenu,
  including,
  Modal,
  Pane
} from '@folio/stripes-testing';


/* The cypressinteractor for the License View pane
 *
 * If we find ourselves doing a certain action on License View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class LicenseViewInteractor {
  static deleteButton = DropdownMenu().find(Button('Delete'));
  static duplicateButton = DropdownMenu().find(Button('Duplicate'));
  static editButton = DropdownMenu().find(Button('Edit'));

  static edit(licenseName) {
    cy.do(Pane(including(licenseName)).clickAction('Edit'));
  }

  static delete(licenseName) {
    cy.do(Pane(including(licenseName)).clickAction('Delete'));
    cy.expect(Modal('Delete license').exists());
    cy.do(Button('Delete').click());
  }

  static paneExists(licenseName) {
    cy.expect(Pane(including(licenseName)).is({ visible: true, index: 2 }));
  }

  static paneDoesNotExist(licenseName) {
    cy.expect(Pane(including(licenseName)).absent());
  }
}
