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

// Do we want to make this an interactor class like the others?
// The main interactor for the agreements 3 pane main landing page
const section = Section({ id: 'pane-agreement-list' });

const newButton = Button('New');

const waitLoading = () => {
  cy.expect(or(
    section.find(MultiColumnListRow()).exists(),
    section.find(HTML(including('No results found. Please check your filters.'))).exists()
  ));
  cy.expect(newButton.exists());
};

const searchField = SearchField({ id: 'input-agreement-search' });
const searchButton = Button('Search');


const createAgreement = (agreement) => {
  cy.do(newButton.click());
  AgreementFormInteractor.waitLoading();
  AgreementFormInteractor.fill(agreement);
  AgreementFormInteractor.save();
  waitLoading();
};

const searchAgreement = (agreementName) => {
  cy.do([
    searchField.fillIn(agreementName),
    searchButton.click()
  ]);
};

const agreementNotVisible = (agreementTitle) => {
  cy.expect(or(
    section.find(MultiColumnListCell(agreementTitle)).absent(),
    section.find(HTML(including('No results found. Please check your filters.'))).exists()
  ));
};

export {
  agreementNotVisible,
  createAgreement,
  searchAgreement,
  waitLoading,
};
