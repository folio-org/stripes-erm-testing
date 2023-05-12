import {
  KeyValue,
  including,
  Pane,
} from '@folio/stripes-testing';

import { HeadlineInteractor as Headline } from '../../../../interactors';

// The main interactor for the job view
export default class JobViewInteractor {
  static expectInitialImportJobPane = (fileName) => {
    cy.expect(Pane(including(`Import package from ${fileName}`)).exists());
    cy.expect(Headline(`Import package from ${fileName}`).exists());
    cy.expect(KeyValue('Running status').has({ value: 'Queued' }));
    cy.expect(KeyValue('Job Type').has({ value: 'File import' }));
  }

  // Assumes we already have the job view open
  static waitForJobCompletion = () => {
    cy.waitUntil(() => {
      cy.reload();
      return cy.get('[data-test-job-status]').then($el => $el[0].innerText === 'Ended');
    }, { timeout: 60000, interval: 5000 });

    cy.expect(KeyValue('Running status').has({ value: 'Ended' }));
  }
}
