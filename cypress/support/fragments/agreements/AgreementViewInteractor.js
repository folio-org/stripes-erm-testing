import {
  Accordion,
  Button,
  DropdownMenu,
  including,
  Modal,
  MultiColumnList,
  Pane,
  or,
  HTML
} from '../../../../interactors';

import DateTools from '../../utils/dateTools';

/* The cypressinteractor for the Agreement View pane
 *
 * If we find ourselves doing a certain action on Agreement View a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementViewInteractor {
  static actionsButton = Pane({ id: 'pane-view-agreement' }).find(Button('Actions'));
  static deleteButton = DropdownMenu().find(Button('Delete'));
  static duplicateButton = DropdownMenu().find(Button('Duplicate'));
  static editButton = DropdownMenu().find(Button('Edit'));
  static exportJsonButton = DropdownMenu().find(
    Button('Export agreement (JSON)')
  );

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
    cy.expect(
      or(
        MultiColumnList('agreement-lines').exists(),
        HTML(including('No results found. Please check your filters.')).exists()
      )
    );
    cy.expect(
      or(
        MultiColumnList('eresources-covered').exists(),
        HTML(including('No results found. Please check your filters.')).exists()
      )
    );
  };

  static openFirstAgreementLine = () => {
    this.openAgreementLinesAccordion();
    cy.do(MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 }));
  };

  static openOptions = () => {
    cy.expect(this.actionsButton.exists());
    cy.do(this.actionsButton.click());
    cy.expect(this.deleteButton.exists());
    cy.expect(this.duplicateButton.exists());
    cy.expect(this.editButton.exists());
    cy.expect(this.exportJsonButton.exists());
  };

  // Unsure about formatting of these two functions
  static newAgreementLine = () => {
    cy.get('[data-testid=line-listing-action-dropdown]').click();
    cy.get('[id=add-agreement-line-button]').click();
  };

  static viewAgreementLineSearch = () => {
    cy.get('[data-testid=line-listing-action-dropdown]').click();
    cy.get('[id=agreement-line-search]').click();
  };

  static recordMetadataInfo(dateCreated) {
    cy.get('[id=agreementInfoRecordMeta]')
      .click()
      .within(() => {
        cy.contains(
          'Record created: ' + DateTools.getFormattedDateWithTime(dateCreated)
        );
        cy.contains(
          'Record last updated: ' +
            DateTools.getFormattedDateWithTime(dateCreated)
        );
      });
  }
}
