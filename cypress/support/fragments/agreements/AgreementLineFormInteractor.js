import {
  Button,
  including,
  Pane,
  TextField,
  Selection,
  Checkbox,
  TextArea,
} from '../../../../interactors';

import { getRandomPostfix } from '../../utils/stringTools';

export default class AgreementLineFormInteractor {
  static paneExists() {
    cy.expect(Pane(including('New agreement line')).is({ visible: true }));
  }

  static selectEresource(eresourceName) {
    cy.do(Selection('E-resource').open());
    cy.do(Selection('E-resource').choose(eresourceName));
    cy.expect(Selection('E-resource').value(eresourceName));
  }

  static fill(fillAgreementLine = {}) {
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const fillDescription =
      fillAgreementLine.description ??
      `autotest_agreement_line_description_${getRandomPostfix()}`;

    // Fill in field, then check it filled in as expected
    cy.do(TextArea('Description').fillIn(fillDescription));
    cy.expect(TextArea('Description').has({ value: fillDescription }));
  }

  static linkSelectedEresource() {
    cy.expect(Button('Link selected e-resource').exists());
    // without this wait the test continously fails for me (cm)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(600);
    cy.do(Button('Link selected e-resource').click());
  }

  static unlinkSelectedEresource() {
    cy.expect(Button('Unlink e-resource').exists());
    cy.do(Button('Unlink e-resource').click());
  }

  static checkCreateAnother(checkValue) {
    cy.expect(Checkbox('Create another').exists());
    if (Checkbox('Create another').is({ checked: checkValue })) {
      cy.do(Checkbox('Create another').click());
      cy.expect(Checkbox('Create another').is({ checked: checkValue }));
    }
  }

  static save() {
    cy.expect(Button('Save').exists());
    cy.do(Button('Save').click());
  }

  static saveAndClose() {
    cy.expect(Button('Save & close').exists());
    cy.do(Button('Save & close').click());
  }

  static checkDescriptionIsValid() {
    cy.get('#agreement-line-description').click();
    cy.get('#agreement-line-note').click();
    cy.contains(
      'Please provide an e-resource or description to continue'
    ).should('not.exist');
  }

  static checkDescriptionIsNotValid() {
    cy.get('#agreement-line-description').click();
    cy.get('#agreement-line-note').click();
    cy.contains(
      'Please provide an e-resource or description to continue'
    ).should('be.visible');
  }

  static waitLoading() {
    cy.expect(TextField('Description').exists());
  }
}
