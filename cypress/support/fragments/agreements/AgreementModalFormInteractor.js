import {
  Button,
  Datepicker,
  including,
  Modal,
  Select,
  TextField,
} from '../../../../interactors';

import DateTools from '../../utils/dateTools';
import { getRandomPostfix } from '../../utils/stringTools';

// The interactor for the agreement modal creation form

export default class AgreementModalFormInteractor {
  static modal = Modal(including('New agreement'));

  static modalExists() {
    cy.expect(this.modal.is({ visible: true }));
  }

  static nameField = this.modal.find(TextField('Name*'));
  static statusField = this.modal.find(Select('Status*'));
  static dateField = this.modal.find(Datepicker({ id: 'period-start-date' }));

  static fillName(name) {
    cy.do(this.nameField.fillIn(name));
  }

  static fillStatus(status) {
    cy.do(this.statusField.choose(status));
  }

  static fillDate(date) {
    cy.do(this.dateField.fillIn(date));
  }

  static fill(agreement = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const name = agreement.name ?? `autotest_agreement_${getRandomPostfix()}`;
    const status = agreement.status ?? 'Draft';
    const startDate = agreement.startDate ?? DateTools.getCurrentDate();

    // Fill in field, then check it filled in as expected
    this.fillName(name);
    cy.expect(this.nameField.has({ value: name }));

    this.fillStatus(status);
    cy.expect(this.statusField.has({ selectedContent: status }));

    this.fillDate(startDate);
    cy.expect(this.dateField.has({ inputValue: startDate }));
  }

  static save() {
    cy.do(Button('Save & close').click());
  }

  static waitLoading() {
    cy.expect(this.nameField.exists());
  }
}
