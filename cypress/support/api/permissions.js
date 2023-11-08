Cypress.Commands.add('getPermissionsApi', ({ searchParams, headers }) => {
  return cy
    .okapiRequest({
      headers,
      path: 'perms/permissions',
      searchParams,
    });
});

Cypress.Commands.add('addPermissionsToNewUserApi', ({ userAndPermissions, headers }) => {
  cy
    .okapiRequest({
      headers,
      method: 'POST',
      path: 'perms/users',
      body: userAndPermissions,
    });
});
