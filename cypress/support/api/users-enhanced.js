import Users from '@folio/stripes-testing/cypress/support/fragments/users/users';

Cypress.Commands.add('deleteUserViaApi', (userId, fromKeycloak) => {
  Users.deleteViaApi(userId, fromKeycloak);
});
