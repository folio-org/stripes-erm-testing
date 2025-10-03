Cypress.Commands.add('createUserWithInternalPermissions', (permissions) => {
  cy.createDefaultTempUser(permissions, {}, { permissionsAreInternal: true });
});
