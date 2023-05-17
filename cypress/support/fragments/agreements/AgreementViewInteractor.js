import {
  Accordion,
  Button,
  including,
  Modal,
  MultiColumnList,
  Pane,
} from '@folio/stripes-testing';


/* The cypressinteractor for the Agreement View pane
 *
 * If we find ourselves doing a certain action on Agreement View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementViewInteractor {
  static edit(agreementName) {
    // EXAMPLE Dropdown 'Actions' - fails with more than one 'Actions' Dropdown
    /*
    cy.do([
      Dropdown('Actions').open(),
      DropdownMenu().find(Button('Edit')).click()
    ]);
    */
    cy.do(Pane(including(agreementName)).clickAction('Edit'));
  }

  static delete(agreementName) {
    cy.do(Pane(including(agreementName)).clickAction('Delete'));
    cy.expect(Modal('Delete agreement').exists());
    cy.do(Button('Delete').click());
  }

  static paneExists(agreementName) {
    cy.expect(Pane(including(agreementName)).is({ visible: true, index: 2 }));
  }

  static paneDoesNotExist(agreementName) {
    cy.expect(Pane(including(agreementName)).absent());
  }

  static openAgreementLinesAccordion = () => {
    cy.expect(Accordion('Agreement lines').exists());
    cy.do(Accordion('Agreement lines').clickHeader());
    cy.expect(MultiColumnList('agreement-lines').exists());
    cy.expect(MultiColumnList('eresources-covered').exists());
  }

  static openFirstAgreementLine = () => {
    this.openAgreementLinesAccordion();
    cy.do(MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 }));
  }
}
