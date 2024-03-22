import {
  Button,
  Select,
  TextField
} from '../../../../interactors';

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
  static fill(license = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const name = license.name ?? `autotest_agreement_${getRandomPostfix()}`;
    const status = license.status ?? 'Active';
    const type = license.type ?? 'Local';

    // Fill in field, then check it filled in as expected
    cy.do(Select('Status*').choose(status));
    cy.expect(Select('Status*').has({ selectedContent: status }));

    cy.do(Select('Type*').choose(type));
    cy.expect(Select('Type*').has({ selectedContent: type }));

    this.fillName(name);
    cy.expect(TextField('Name*').has({ value: name }));

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
