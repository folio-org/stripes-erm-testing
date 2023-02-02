import {
  Button,
  MultiColumnListCell,
  MultiColumnListRow,
  Section,
  or,
  including,
  HTML
} from '@folio/stripes-testing';

import NewAgreement from './newAgreement';

const section = Section({ id: 'pane-agreement-list' });
const newButton = Button('New');
const waitLoading = () => {
  cy.expect(or(
    section.find(MultiColumnListRow()).exists(),
    section.find(HTML(including('No results found. Please check your filters.'))).exists()
  ));
  cy.expect(newButton.exists());
};

export default {
  waitLoading,

  create: (specialAgreement) => {
    cy.do(newButton.click());
    NewAgreement.waitLoading();
    NewAgreement.fill(specialAgreement);
    NewAgreement.save();
    waitLoading();
  },

  agreementNotVisible: (agreementTitle) => cy.expect(section.find(MultiColumnListCell(agreementTitle)).absent())
};

