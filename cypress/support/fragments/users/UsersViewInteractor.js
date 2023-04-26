import {
  including,
  Pane
} from '@folio/stripes-testing';


/* The cypressinteractor for the Users View pane
 *
 * If we find ourselves doing a certain action on Users View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class UsersViewInteractor {
  static userExists(lastName) {
    cy.expect(Pane(including(lastName)).is({ visible: true, index: 2 }));
  }

  static userDoesNotExist(lastName) {
    cy.expect(Pane(including(lastName)).absent());
  }
}
