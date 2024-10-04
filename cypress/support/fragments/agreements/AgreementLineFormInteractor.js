import {
  Button,
  Checkbox,
  including,
  Pane,
  Selection,
  SelectionOption,
  TextArea,
} from '../../../../interactors';

import { getRandomPostfix } from '../../utils/stringTools';

export default class AgreementLineFormInteractor {
  static paneExists() {
    cy.expect(Pane(including('New agreement line')).is({ visible: true }));
  }

  static getDescriptionField() {
    return TextArea('Description');
  }

  static getNoteField() {
    return TextArea('Note');
  }

  static getCreateAnotherCheckbox() {
    return Checkbox('Create another');
  }

  static getBasketSelector() {
    return Selection({ id: 'linkedResource-basket-selector' });
  }

  static getLinkSelectedEresourceButton() {
    return Button('Link selected e-resource');
  }

  static selectEresource(eresourceName) {
    const basketSelector = this.getBasketSelector();
    cy.do(basketSelector.open());
    cy.do(SelectionOption(eresourceName).click());
    // This expect doesn't work right now... keep an eye on it
    // cy.expect(basketSelector.has({ value: eresourceName }));
  }

  static fill(fillAgreementLine = {}) {
    const descriptionField = this.getDescriptionField();
    // Default the necessary options so they always exist, no matter if only a subset gets passed in;
    const fillDescription =
      fillAgreementLine.description ??
      `autotest_agreement_line_description_${getRandomPostfix()}`;

    // Fill in field, then check it filled in as expected
    cy.do(descriptionField.fillIn(fillDescription));
    cy.expect(descriptionField.has({ value: fillDescription }));
  }

  // Not sure about this in honesty... feels like we should be able to fill fields slightly smartly from single "fill" method
  static fillNote(fillAgreementLine = {}) {
    const noteField = this.getNoteField();
    const fillNote =
      fillAgreementLine.note ??
      `autotest_agreement_line_note_${getRandomPostfix()}`;

    // Fill in field, then check it filled in as expected
    cy.do(noteField.fillIn(fillNote));
    cy.expect(noteField.has({ value: fillNote }));
  }

  static linkSelectedEresource() {
    const button = this.getLinkSelectedEresourceButton();
    cy.expect(button.exists());
    // without this wait the test continously fails for me (cm)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.do(button.click());
  }

  static unlinkSelectedEresource() {
    cy.expect(Button('Unlink e-resource').exists());
    cy.do(Button('Unlink e-resource').click());
  }

  static checkCreateAnother(checkValue) {
    const checkbox = this.getCreateAnotherCheckbox();
    cy.expect(checkbox.exists());
    if (checkValue) {
      cy.do(checkbox.checkIfNotSelected());
    } else {
      cy.do(checkbox.uncheckIfSelected());
    }
    cy.expect(checkbox.is({ checked: checkValue }));
  }

  static save() {
    cy.expect(Button('Save').exists());
    cy.do(Button('Save').click());
    // FIXME Add check here that the save has _completed_ and form has rerendered without wait -- not sure best way to do that
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(600);
  }

  static saveAndClose() {
    cy.expect(Button('Save & close').exists());
    cy.do(Button('Save & close').click());
  }

  static checkDescriptionIsValid() {
    cy.contains(
      'Please provide an e-resource or description to continue'
    ).should('not.exist');
  }

  static checkDescriptionIsNotValid() {
    cy.contains(
      'Please provide an e-resource or description to continue'
    ).should('be.visible');
  }

  static waitLoading() {
    cy.expect(TextArea('Description').exists());
  }
}
