import {
  Button,
} from '../../../../interactors';


/* The cypressinteractor for the Package View pane
 *
 * If we find ourselves doing a certain action on Package View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class PackageViewInteractor {
  static addToBasketButton = Button('Add package to basket');

  static addToBasket = () => {
    cy.do(this.addToBasketButton.click());
  }
}
