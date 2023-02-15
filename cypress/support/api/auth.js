Cypress.Commands.add('getToken', (username, password) => {
  cy
    .okapiRequest({
      method: 'POST',
      path: 'bl-users/login',
      body: { username, password }
    })
    .then(({ headers }) => {
      // Remove service point work because it might not apply locally
      Cypress.env('token', headers['x-okapi-token']);
    });
});

Cypress.Commands.add('setUserPassword', (userCredentials) => {
  cy
    .okapiRequest({
      method: 'POST',
      path: 'authn/credentials',
      body: userCredentials,
      isDefaultSearchParamsRequired: true,
    });
});

Cypress.Commands.add('getAdminToken', () => {
  cy.getToken(Cypress.env('login_username'), Cypress.env('login_password'));
});
