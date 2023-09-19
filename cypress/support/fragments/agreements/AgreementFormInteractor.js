import {
  Button,
  Datepicker,
  including,
  Pane,
  Select,
  TextField,
} from '../../../../interactors';

import AgreementsSettingsInteractor from './AgreementsSettingsInteractor';

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
    fillAgreement.name =
      fillAgreement.name || `autotest_agreement_${getRandomPostfix()}`;
    fillAgreement.status = fillAgreement.status || 'Draft';
    fillAgreement.startDate =
      fillAgreement.startDate || DateTools.getCurrentDate();

    AgreementsSettingsInteractor.fetchStatusLabel(fillAgreement);
    // Fill in field, then check it filled in as expected
    this.fillName(fillAgreement.name);
    cy.expect(TextField('Name*').has({ value: fillAgreement.name }));

    cy.do(Select('Status*').choose(fillAgreement.status));
    cy.expect(Select('Status*').has({ selectedContent: fillAgreement.status }));

    cy.do(
      Datepicker({ id: 'period-start-date-0' }).fillIn(fillAgreement.startDate)
    );
    cy.expect(
      Datepicker({ id: 'period-start-date-0' }).has({
        inputValue: fillAgreement.startDate,
      })
    );

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
