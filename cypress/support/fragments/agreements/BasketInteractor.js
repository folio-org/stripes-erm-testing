import {
  Button,
  MultiColumnList,
  MultiColumnListCell,
  Pane,
  including,
} from '../../../../interactors';
import AgreementModalFormInteractor from './AgreementModalFormInteractor';


/* The cypressinteractor for the Basket View pane
 *
 * If we find ourselves doing a certain action on Basket View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class BasketInteractor {
  static createNewAgreementButton = Button('Create new agreement');

  static waitLoading = () => {
    cy.expect(Pane(including('ERM basket')).exists());
    cy.expect(MultiColumnList().exists());
    cy.expect(this.createNewAgreementButton.exists());
  }

  static visitBasket = () => {
    cy.visit('/erm/basket');
  }

  static createAgreement = (agreement) => {
    cy.do(this.createNewAgreementButton.click());
    AgreementModalFormInteractor.modalExists();
    AgreementModalFormInteractor.waitLoading();
    AgreementModalFormInteractor.fill(agreement);
    AgreementModalFormInteractor.save();
  }

  static checkResourceIsInBasket = (resourceName) => {
    cy.expect(MultiColumnListCell(resourceName).exists());
  }

  // TODO potentially we should look at changing this to use the interactor?
  // This takes an "index", which is position in list starting from 0,
  // since the ACTUAL first checkbox is "select all", we add one to this index
  static ensureBasketResourceIsSelected = (index = 0) => {
    cy.get('input[type="checkbox"]').eq(index + 1).should('be.checked');
  }
}
