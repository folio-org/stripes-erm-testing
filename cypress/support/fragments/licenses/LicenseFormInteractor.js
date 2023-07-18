import {
  Button,
  TextField
} from '@folio/stripes-testing';

import { SelectInteractor as Select } from '../../../../interactors';

import { getRandomPostfix } from '../../utils/stringTools';

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
  static fill(fillLicense = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const fillName = fillLicense.name ?? `autotest_agreement_${getRandomPostfix()}`;
    const fillStatus = fillLicense.status ?? 'Active';
    const fillType = fillLicense.type ?? 'Local';

    // Fill in field, then check it filled in as expected
    cy.do(Select('Status*').choose(fillStatus));
    cy.expect(Select('Status*').has({ selectedContent: fillStatus }));

    cy.do(Select('Type*').choose(fillType));
    cy.expect(Select('Type*').has({ selectedContent: fillType }));

    this.fillName(fillName);
    cy.expect(TextField('Name*').has({ value: fillName }));

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
