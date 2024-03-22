/* IMPORTANT -- when getToken or getAdminToken is called,
 * the token for API calls gets set, so API calls will have
 * the requisite perms. This is _separate_ from the login function,
 * which ensures the in UI actions are being performed by a given user.
 *
 * The calls to getAdminToken have been moved outside of each test,
 * and into the "viaApi" methods which are almost always necessary to run as admin
 * outside of a logged in env.
 *
 * New pattern then for calling a "viaApi" method with specific login is:
 *
 * cy.getToken(<username>, <password>);
 * cy.somethingViaApi({ ...data, runWithAdminToken: false });
 *
 * New "viaApi" methods should be structured to reflect this as well
 */

Cypress.Commands.add('getTokensFromLoginWithExpiry', ({ headers }) => {
  // Grab access and refresh tokens
  const accessToken = headers['set-cookie'][0].split(';')[0].split('=')[1];
  const refreshToken = headers['set-cookie'][1].split(';')[0].split('=')[1];

  Cypress.env('accessToken', accessToken);
  Cypress.env('refreshToken', refreshToken);

  Cypress.env('decodedAccessToken', JSON.parse(atob(accessToken.split('.')[1], 'base64').toString()));

  Cypress.env('headersWithCookie', { Cookie: accessToken });
});


Cypress.Commands.add('getToken', (username, password) => {
  const accessTokenCookie = Cypress.env('accessTokenCookie');
  const decodedAccessToken = Cypress.env('decodedAccessToken');

  // If accessToken is missing or expired (or close to expiry), relogin
  // I think we can ignore refreshing, since this can act basically as a brand new login, with its own access token
  // And is separate from the browser login *shrug*
  if ((!accessTokenCookie || !decodedAccessToken) || (decodedAccessToken.exp - Date.now() <= 100)) {
    cy.okapiRequest({
      method: 'POST',
      path: 'bl-users/login-with-expiry',
      body: { username, password }
    }).then(cy.getTokensFromLoginWithExpiry);
  }

  // Otherwise we have working accessToken in Cypress.env
});

Cypress.Commands.add('setUserPassword', ({ userCredentials, headers }) => {
  cy
    .okapiRequest({
      headers,
      method: 'POST',
      path: 'authn/credentials',
      body: userCredentials,
      isDefaultSearchParamsRequired: true,
    });
});

Cypress.Commands.add('getAdminToken', () => {
  cy.getToken(Cypress.env('login_username'), Cypress.env('login_password'));
});
