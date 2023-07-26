import {
  Checkbox,
} from '@folio/stripes-testing';

import { normalize } from '../../utils/stringTools';

/* The cypressinteractor for the Agreement Settings page
 *
 * If we find ourselves doing a certain action on Agreement Settings a lot,
 * ie more than once, in various tests, then we should add an action here and import to ensure consistency.
 */
export default class AgreementsSettingsInteractor {
  static hideKbCheckbox = Checkbox('Hide internal agreements knowledgebase');
  static hideEresourcesFunctionalityCheckbox = Checkbox({ id: 'hideEResourcesFunctionality' })

  static navigateToAgreementsSettings() {
    cy.visit('/settings/erm/general');
  }

  static ensureHideAgreementsKBUnchecked() {
    this.navigateToAgreementsSettings();
    cy.expect(this.hideKbCheckbox.exists());
    cy.expect(this.hideKbCheckbox.is({ checked: false }));
  }

  static fetchStatusLabel = (agreement) => {
    const refdataDesc = 'SubscriptionAgreement.AgreementStatus';
    cy.getAgreementsRefdataValues(refdataDesc).then((refdata) => {
      if (refdata.every(obj => obj.label !== agreement.status)) {
        cy.getAgreementsRefdataLabelFromValue(refdataDesc, normalize(agreement.status))
          .then((refdataLabel) => {
            agreement.status = refdataLabel;
          });
      }
    });
  }

  static fetchOtherStatusLabel = (agreementStatus) => {
    const refdataDesc = 'SubscriptionAgreement.AgreementStatus';
    cy.getAgreementsRefdataValues(refdataDesc).then((refdata) => {
      const firstObjWithDifferentLabel = refdata.find(obj => obj.label !== agreementStatus);
      if (firstObjWithDifferentLabel) {
        cy.wrap(firstObjWithDifferentLabel.label).as('otherStatusLabel');
      }
    });
  }
}

