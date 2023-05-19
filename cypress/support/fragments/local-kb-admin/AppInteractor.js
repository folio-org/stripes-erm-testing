import {
  Button,
  DropdownMenu,
  HTML,
  including,
  MultiColumnListRow,
  or,
  Pane,
} from '@folio/stripes-testing';

import { AppListInteractor as AppList } from '../../../../interactors';

import JsonImportJobFormInteractor from './JsonImportJobFormInteractor';
import JobViewInteractor from './JobViewInteractor';

/* We can import other interactors here and expose their functionality
 * to allow for a singular "AppInteractor" import in our tests.
 * I'm not sure if that's a good idea or not, I quite like the idea that different
 * pages require different interactors. However, allowing certain much-reused sets of functionality,
 * such as creating a new job, to be controlled via the AppInteractor does make some sense.
 */

// Making Appinteractor a class so it is consistent and clear where each action is coming from
// The main interactor for the local-kb-admin 3 pane main landing page
export default class AppInteractor {
  static actionsButton = Pane(including('Local KB admin')).find(Button('Actions'));
  static jsonButton = DropdownMenu().find(Button('New JSON import job'));
  static kbartButton = DropdownMenu().find(Button('New KBART import job'));
  static chooseFileButton = Button('or choose file');

  static waitLoading = () => {
    cy.expect(or(
      this.section.find(MultiColumnListRow()).exists(),
      this.section.find(HTML(including('No results found. Please check your filters.'))).exists()
    ));
    cy.expect(this.actionsButton.exists());
  };

  static openLocalKbAdminApp = () => {
    cy.do(AppList().navTo('Local KB admin')).then(() => {
      cy.url().should('include', '/local-kb-admin');
      cy.expect(Pane(including('Local KB admin')).exists());
    });
  };

  static filterPanePresent = (paneId) => {
    cy.expect(Pane({ id: paneId }).is({ visible: true, index: 0 }));
  };

  static openOptions = () => {
    cy.expect(this.actionsButton.exists());
    cy.do(this.actionsButton.click());
    cy.expect(this.kbartButton.exists());
    cy.expect(this.jsonButton.exists());
  }

  static selectJsonImportJob = () => {
    this.openOptions();
    cy.expect(this.jsonButton.exists());
    cy.do(this.jsonButton.click());
    JsonImportJobFormInteractor.waitLoading();
  }

  // Assumes you are in localKB app, but nothing else
  static uploadJsonFile = (fileName) => {
    this.selectJsonImportJob();
    JsonImportJobFormInteractor.createJob(fileName);
  }

  // This skips through all the steps in one go. For testing of
  // local-kb-admin itself we can step through more manually in individual tests
  static uploadJsonFileAndAwaitCompletion = (fileName) => {
    this.uploadJsonFile(fileName);
    JobViewInteractor.expectImportJobPane(fileName);
    JobViewInteractor.waitForJobCompletion(fileName);
  }
}
