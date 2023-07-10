import {
  Button,
  including,
  Pane,
  Select,
  TextField
} from '@folio/stripes-testing';

import { DatepickerInteractor as Datepicker } from '../../../../interactors';

import DateTools from '../../utils/dateTools';
import { getRandomPostfix } from '../../utils/stringTools';

/* The interactor for the create/edit page form
 *
 * If we find ourselves doing a certain action on AgreementForm a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementFormInteractor {
  static paneExists() {
    cy.expect(Pane(including('New agreement')).is({ visible: true }));
  }

  static fillName(name) {
    cy.do(TextField('Name*').fillIn(name));
  }

  static fill(fillAgreement = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const fillName = fillAgreement.name ?? `autotest_agreement_${getRandomPostfix()}`;
    const fillStatus = fillAgreement.status ?? 'Draft';
    const fillStartDate = fillAgreement.startDate ?? DateTools.getCurrentDate();

    // Fill in field, then check it filled in as expected
    this.fillName(fillName);
    cy.expect(TextField('Name*').has({ value: fillName }));

    cy.do(Select('Status*').choose(fillStatus));
    cy.get('#edit-agreement-status').invoke('val').then(selectedValue => {
      cy.get(`#edit-agreement-status option[value="${selectedValue}"]`).invoke('text').should('equal', fillStatus);
    });

    cy.do(Datepicker({ id: 'period-start-date-0' }).fillIn(fillStartDate));
    cy.expect(Datepicker({ id: 'period-start-date-0' }).has({ inputValue: fillStartDate }));

    /* If we need more fields in order to set up frequently tested agreement properties,
       * they can be added here. Otherwise we can treat this as "fill basic agreement" and
       * fill more fields per test.
       */
  }

  static save() {
    cy.do(Button('Save & close').click());
  }

  static waitLoading() {
    cy.expect(TextField('Name*').exists());
  }
}
