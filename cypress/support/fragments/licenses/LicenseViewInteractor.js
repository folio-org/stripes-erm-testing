import {
  Button,
  Dropdown,
  DropdownMenu,
  including,
  Modal,
  Pane,
  or
} from '@folio/stripes-testing';


/* The cypressinteractor for the License View pane
 *
 * If we find ourselves doing a certain action on License View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class LicenseViewInteractor {
  static chooseAction(actionName) {
    /* 'choose' command does not work properly in cypress,
     * it tries to look for the dropdown after choosing option,
     * which is normally no longer being rendered.
     * The following is a more manual workaround.
     */
    cy.do([
      Dropdown('Actions').open(),
      DropdownMenu().find(Button(actionName)).click()
    ]);
  }

  static edit() {
    this.chooseAction('Edit');
  }

  static delete() {
    this.chooseAction('Delete');
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
