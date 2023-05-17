import {
  Button,
  Callout,
  including,
  KeyValue,
  Pane,
} from '@folio/stripes-testing';

// The main interactor for the json import job form
export default class JsonImportJobFormInteractor {
  static chooseFileButton = Button('or choose file');
  static saveAndCloseButton = Button('Save & close');

  static successCalloutTextFromFileName = (fileName) => `JSON package import job created : Import package from ${fileName}`;

  static waitLoading = () => {
    cy.expect(Pane(including('New JSON job')).exists());
    cy.expect(this.chooseFileButton.exists());
  };

  static uploadFile = (fileName) => {
    // `force: true` is mandatory because "element `<input>` is not visible because it has CSS property: `display: none`"
    cy.get('input[type=file]').selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop', force: true });
    cy.expect(KeyValue('File name').has({ value: fileName }));
    cy.expect(this.saveAndCloseButton.exists());
  }

  static createJob = (fileName) => {
    this.uploadFile(fileName);
    cy.do(this.saveAndCloseButton.click());
    cy.expect(Callout(this.successCalloutTextFromFileName(fileName)).exists());
  }
}
