import {
  Button,
  Select,
  TextField
} from '@folio/stripes-testing';

import { DatepickerInteractor as Datepicker } from '../../../../interactors';

import DateTools from '../../utils/dateTools';
import { getRandomPostfix, normalize } from '../../utils/stringTools';

/* The interactor for the create/edit page form
 * This CAN also be used for unit tests if we so wish.
 *
 *
 * Not entirely sure why we would need this to be a class not just a collection of
 * exported methods/fields like in AppInteractor.
 *
 * If we find ourselves doing a certain action on AgreementForm a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementFormInteractor {
  // We default the fill to a very basic agreement
  static fill(fillAgreement = {
    name: `autotest_agreement_${getRandomPostfix()}`,
    status: 'Draft',
    startDate: DateTools.getCurrentDate()
  }) {
    // Fill in field, then check it filled in as expected
    cy.do(TextField('Name*').fillIn(fillAgreement.name));
    cy.expect(TextField('Name*').has({ value: fillAgreement.name }));

    cy.do(Select('Status*').choose(fillAgreement.status));
    cy.expect(Select('Status*').has({ value: normalize(fillAgreement.status) }));

    cy.do(Datepicker({ id: 'period-start-date-0' }).fillIn(fillAgreement.startDate));
    cy.expect(Datepicker({ id: 'period-start-date-0' }).has({ inputValue: fillAgreement.startDate }));

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