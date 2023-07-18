import {
  Button,
  HTML,
  including,
  MultiColumnListCell,
  MultiColumnListRow,
  or,
  Pane,
  SearchField,
  Section,
} from '@folio/stripes-testing';

/* We can import other interactors here and expose their functionality
 * to allow for a singular "AppInteractor" import in our tests.
 * I'm not sure if that's a good idea or not, I quite like the idea that different
 * pages require different interactors. However, allowing certain much-reused sets of functionality,
 * such as creating a new agreement, to be controlled via the AppInteractor does make some sense.
 */
import AgreementFormInteractor from './AgreementFormInteractor';
import HomeInteractor from '../HomeInteractor';

// Making Appinteractor a class so it is consistent and clear where each action is coming from
// The main interactor for the agreements 3 pane main landing page
export default class AppInteractor {
  static section = Section({ id: 'pane-agreement-list' });

  static newButton = Button('New');

  static localKbSearchButton = Button('Local KB search');
  static packagesButton = Button('Packages');
  static platformsButton = Button('Platforms');
  static titlesButton = Button('Titles');

  static openBasketButton = Button({ id: 'open-basket-button' });

  static waitLoading = () => {
    cy.expect(or(
      this.section.find(MultiColumnListRow()).exists(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
    cy.expect(this.newButton.exists());
  };

  static openLocalKB = () => {
    cy.do(this.localKbSearchButton.click());
  }

  static openBasket = () => {
    cy.do(this.openBasketButton.click());
  }

  static createAgreement = (agreement) => {
    cy.do(this.newButton.click());
    AgreementFormInteractor.waitLoading();
    AgreementFormInteractor.fill(agreement);
    AgreementFormInteractor.save();
    this.waitLoading();
  };

  static searchAgreement = (agreementName) => {
    cy.do([
      SearchField({ id: 'input-agreement-search' }).fillIn(agreementName),
      Button('Search').click()
    ]);
  };

  // Assumes we only match 1 package and it automatically opens
  static searchForPackage = (packageName) => {
    cy.do(this.packagesButton.click());
    this.searchPackage(packageName);
    cy.expect(Pane(including(packageName)).is({ visible: true, index: 2 }));
  }

  static agreementNotVisible = (agreementTitle) => {
    cy.expect(or(
      this.section.find(MultiColumnListCell(agreementTitle)).absent(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
  };

  static openAgreementsApp = () => {
    HomeInteractor.navToApp('Agreements');
    cy.url().should('include', '/erm/agreements');
    cy.expect(Pane(including('Agreements')).exists());
    cy.expect(Button('Agreements search').exists());
    cy.expect(Button('Local KB search').exists());
  };

  static filterPanePresent = (paneId) => {
    cy.expect(Pane({ id: paneId }).is({ visible: true, index: 0 }));
  };

  static searchPackage = (packageName) => {
    cy.do([
      SearchField({ id: 'input-package-search' }).fillIn(packageName),
      Button('Search').click()
    ]);
  };
}
