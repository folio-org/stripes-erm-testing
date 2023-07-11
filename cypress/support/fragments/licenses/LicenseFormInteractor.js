import {
  Button,
  TextField
} from '@folio/stripes-testing';

import { DatepickerInteractor as Datepicker, SelectInteractor as Select } from '../../../../interactors';

import DateTools from '../../utils/dateTools';
import { getRandomPostfix, normalize } from '../../utils/stringTools';

/* The interactor for the create/edit page form
 *
 * If we find ourselves doing a certain action on LicenseForm a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class LicenseFormInteractor {
  static fillName(name) {
    cy.do(TextField('Name*').fillIn(name));
  }

  // We default the fill to a very basic license
  static fill(fillLicense = {
    name: `autotest_license_${getRandomPostfix()}`,
    status: 'Not yet active',
    type: 'Consortial',
    startDate: DateTools.getCurrentDate()
  }) {
    // Fill in field, then check it filled in as expected
    cy.do(Select('Status*').choose(fillLicense.status));
    cy.expect(Select('Status*').has({ selectedContent: fillLicense.status }));

    cy.do(Select('Type*').choose(fillLicense.type));
    cy.expect(Select('Type*').has({ value: normalize(fillLicense.type) }));

    cy.do(Datepicker({ id: 'edit-license-start-date' }).fillIn(fillLicense.startDate));
    cy.expect(Datepicker({ id: 'edit-license-start-date' }).has({ inputValue: fillLicense.startDate }));

    this.fillName(fillLicense.name);
    cy.expect(TextField('Name*').has({ value: fillLicense.name }));

    /* If we need more fields in order to set up frequently tested license properties,
     * they can be added here. Otherwise we can treat this as "fill basic license" and
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
