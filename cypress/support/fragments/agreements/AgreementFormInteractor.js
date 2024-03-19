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

  static saveButton = Button('Save & close');

  static fill(agreement = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const name =
    agreement.name ?? `autotest_agreement_${getRandomPostfix()}`;
    const status = agreement.status ?? 'Draft';
    const startDate =
    agreement.startDate ?? DateTools.getCurrentDate();

    AgreementsSettingsInteractor.fetchStatusLabel(agreement);
    // Fill in field, then check it filled in as expected
    cy.do(Select('Status*').choose(status));
    cy.expect(Select('Status*').has({ selectedContent: status }));

    cy.do(
      Datepicker({ id: 'period-start-date-0' }).fillIn(startDate)
    );
    cy.expect(
      Datepicker({ id: 'period-start-date-0' }).has({
        inputValue: startDate,
      })
    );
    this.fillName(name);
    cy.expect(TextField('Name*').has({ value: name }));

    /* If we need more fields in order to set up frequently tested agreement properties,
     * they can be added here. Otherwise we can treat this as "fill basic agreement" and
     * fill more fields per test.
     */
  }

  static save() {
    cy.do(this.saveButton.click());
  }

  static waitLoading() {
    cy.expect(TextField('Name*').exists());
  }
}
