import {
  Button,
  Dropdown,
  DropdownMenu,
  including,
  Modal,
  Pane,
} from '@folio/stripes-testing';


/* The cypressinteractor for the Agreement View pane
 *
 * If we find ourselves doing a certain action on Agreement View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementViewInteractor {
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
    cy.expect(Modal('Delete agreement').exists());
    cy.do(Button('Delete').click());
  }

  static paneExists(agreementName) {
    cy.expect(Pane(including(agreementName)).is({ visible: true, index: 2 }));
  }

  static paneDoesNotExist(agreementName) {
    cy.expect(Pane(including(agreementName)).absent());
  }
}
