import {
  Button,
  Modal,
  Pane,
} from '../../../../interactors';


/* The cypressinteractor for the Agreement View pane
 *
 * If we find ourselves doing a certain action on Agreement View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementLineViewInteractor {
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
}
