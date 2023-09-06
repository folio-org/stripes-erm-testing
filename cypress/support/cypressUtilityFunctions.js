// This will get the first id present in the url...
// We might want to expand it to allow it to fetch all the ids in the url,
// returning the first if only one, or all if > 1...
// Alternatively we could have a getIdsFromURL
Cypress.Commands.add('getIdFromURL', () => {
  cy.url().then(($url) => {
    const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    return $url.match(regex)[0];
  });
});

Cypress.Commands.add('getAllIdsFromURL', () => {
  cy.url().then(($url) => {
    const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
    const matches = Array.from($url.matchAll(regex), match => match[0]);
    return matches;
  });
});

