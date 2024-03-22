import {
  Button,
  Modal,
  DropdownMenu,
  Pane,
} from '../../../../interactors';


/* The cypressinteractor for the Agreement View pane
 *
 * If we find ourselves doing a certain action on Agreement View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementLineViewInteractor {
  static deleteValueModal = Modal('Delete agreement line');
  static actionsButton = Pane({ id: 'pane-view-agreement-line' }).find(Button('Actions'));
  static deleteButton = DropdownMenu().find(Button('Delete'));
  static editButton = DropdownMenu().find(Button('Edit'));

  static delete(paneId) {
    cy.do(Pane({ id: paneId }).clickAction('Delete'));
    cy.expect(Modal('Delete agreement line').exists());
    cy.do(Button('Delete').click());
  }

  static paneExists(paneId) {
    cy.expect(Pane({ id: paneId }).is({ visible: true, index: 2 }));
  }

  static paneDoesNotExist(paneId) {
    cy.expect(Pane({ id: paneId }).absent());
  }

  static closePane(paneId) {
    this.paneExists(paneId);
    cy.do(Pane({ id: paneId }).dismiss());
    this.paneDoesNotExist(paneId);
  }

  static openOptions = () => {
    cy.expect(this.actionsButton.exists());
    cy.do(this.actionsButton.click());
    cy.expect(this.editButton.exists());
    cy.expect(this.deleteButton.exists());
  };
}
