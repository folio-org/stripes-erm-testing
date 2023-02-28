import {
  Button,
  Dropdown,
  DropdownMenu,
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
 * such as creating a new license, to be controlled via the AppInteractor does make some sense.
 */
import LicenseFormInteractor from './LicenseFormInteractor';

// Making Appinteractor a class so it is consistent and clear where each action is coming from
// The main interactor for the licenses 3 pane main landing page
export default class AppInteractor {
  static section = Section({ id: 'pane-license-list' });

  static actionButton = Button('Actions');

  static waitLoading = () => {
    cy.expect(or(
      this.section.find(MultiColumnListRow()).exists(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
    cy.expect(this.actionButton.exists());
  };

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

  static createLicense = (license) => {
    console.log('app interactor license %o', license);
    cy.do(this.chooseAction('New'));
    LicenseFormInteractor.waitLoading();
    LicenseFormInteractor.fill(license);
    LicenseFormInteractor.save();
    this.waitLoading();
  };

  static searchLicense = (licenseName) => {
    cy.do([
      SearchField({ id: 'input-license-search' }).fillIn(licenseName),
      Button('Search').click()
    ]);
  };

  static licenseNotVisible = (licenseTitle) => {
    cy.expect(or(
      this.section.find(MultiColumnListCell(licenseTitle)).absent(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
  };
}
