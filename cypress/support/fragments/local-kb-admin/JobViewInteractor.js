import {
  Headline,
  including,
  KeyValue,
  Pane
} from '../../../../interactors';

import { normalize } from '../../utils/stringTools';

// The main interactor for the job view
export default class JobViewInteractor {
  static expectImportJobPane = (fileName) => {
    cy.expect(Pane(including(`Import package from ${fileName}`)).exists());
    cy.expect(Headline(`Import package from ${fileName}`).exists());
    // Race condition here, commenting out -- can be in progress or even ended by the time we get here
    // cy.expect(KeyValue('Running status').has({ value: 'Queued' }));
    cy.expect(KeyValue('Job Type').has({ value: 'File import' }));
  }

  // Assumes we already have the job view open
  static waitForJobCompletion = () => {
    const refdataDesc = 'PersistentJob.Status';
    let jobStatus = 'Ended';
    cy.getAgreementsRefdataValues(refdataDesc)
      .then((refdata) => {
        if (refdata.every(obj => obj.label !== jobStatus)) {
          cy.getAgreementsRefdataLabelFromValue(refdataDesc, normalize(jobStatus))
            .then((refdataLabel) => {
              jobStatus = refdataLabel;
            });
        }
      })
      // this .then is important, otherwise 'jobStatus' is not updated and still contains pre-set value
      .then(() => {
        cy.waitUntil(() => {
          cy.reload();
          return cy.get('[data-test-job-status]').then($el => $el[0].innerText === jobStatus);
        }, { timeout: 60000, interval: 5000 });

        cy.expect(KeyValue('Running status').has({ value: jobStatus }));
      });
  }
}
