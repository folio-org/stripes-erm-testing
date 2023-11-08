Cypress.Commands.add('getAllIdsFromURL', () => {
  cy.url().then(($url) => {
    const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
    const matches = Array.from($url.matchAll(regex), match => match[0]);
    return matches;
  });
});

// Most common use case is just grabbing a single id, simplify tests for that use case
Cypress.Commands.add('getIdFromURL', () => {
  cy.getAllIdsFromURL().then(([id]) => {
    return id;
  });
});

/* Older, manual getIdFromURL (Refactored above to use getAllIdsFromURL, kept here for now in case it's needed later)
  Cypress.Commands.add('getIdFromURL', () => {
    cy.url().then(($url) => {
      const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      return $url.match(regex)[0];
    });
  });
*/
