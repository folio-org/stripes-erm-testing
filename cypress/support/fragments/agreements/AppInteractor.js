import {
  Button,
  HTML,
  including,
  MultiColumnListCell,
  MultiColumnListRow,
  or,
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

// Making Appinteractor a class so it is consistent and clear where each action is coming from
// The main interactor for the agreements 3 pane main landing page
export default class AppInteractor {
  static section = Section({ id: 'pane-agreement-list' });

  static newButton = Button('New');

  static waitLoading = () => {
    cy.expect(or(
      this.section.find(MultiColumnListRow()).exists(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
    cy.expect(this.newButton.exists());
  };

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

  static agreementNotVisible = (agreementTitle) => {
    cy.expect(or(
      this.section.find(MultiColumnListCell(agreementTitle)).absent(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
  };
}
