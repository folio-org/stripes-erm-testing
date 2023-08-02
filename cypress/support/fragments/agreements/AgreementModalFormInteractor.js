import {
  Button,
  including,
  TextField,
  Modal
} from '@folio/stripes-testing';

import { Datepicker, Select } from '../../../../interactors';

import DateTools from '../../utils/dateTools';
import { getRandomPostfix } from '../../utils/stringTools';

// The interactor for the agreement modal creation form

export default class AgreementModalFormInteractor {
  static modalExists() {
    cy.expect(Modal(including('New agreement')).is({ visible: true }));
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
    cy.expect(Select('Status*').has({ selectedContent: fillStatus }));

    cy.do(Datepicker({ id: 'period-start-date' }).fillIn(fillStartDate));
    cy.expect(Datepicker({ id: 'period-start-date' }).has({ inputValue: fillStartDate }));
  }

  static save() {
    cy.do(Button('Save & close').click());
  }

  static waitLoading() {
    cy.expect(TextField('Name*').exists());
  }
}
