import localforage from 'localforage';

import {
  Button,
  Dropdown,
  Heading,
  including,
  TextField,
} from '../../interactors';

Cypress.Commands.add('login', (username, password, visitPath = { path: '/', waiter: () => cy.expect(Heading(including('Welcome')).exists()) }) => {
  cy.clearCookies();
  // We use a behind-the-scenes method of ensuring we are logged
  // out, rather than using the UI, in accordance with the Best
  // Practices guidance at
  // https://docs.cypress.io/guides/references/best-practices.html#Organizing-Tests-Logging-In-Controlling-State
  localforage.removeItem('okapiSess');

  cy.visit(visitPath.path);

  // Todo: find the way to wrap interactor to cy chainable object
  cy.do([
    TextField('Username').fillIn(username),
    TextField('Password').fillIn(password),
    Button('Log in').click()
  ]);

  // TODO: find the way how customize waiter timeout in case of interactors(cy.wrap may be)
  // https://stackoverflow.com/questions/57464806/set-timeout-for-cypress-expect-assertion
  // https://docs.cypress.io/api/commands/wrap#Requirements

  visitPath.waiter();

  /* // Ensure access tokens are properly set in env
  // FIXME Handle post Q release
  cy.getCookie('folioAccessToken').then(cookieObj => {
    Cypress.env('accessToken', cookieObj.value);
  }); */

  // There seems to be a race condition here: sometimes there is
  // re-render that happens so quickly that following actions like
  //       cy.get('#app-list-item-clickable-courses-module').click()
  // fail because the button becomes detached from the DOM after the
  // get() but before the click().
});

Cypress.Commands.add('logout', () => {
  cy.do([
    // Name can change based on tenant and servicePoint
    Dropdown({ id: 'profileDropdown' }).open(),
    // Sometimes button says "log out", sometimes it says Log out from FOLIO, keep SSO session
    // Use ID instead
    Button({ id: 'clickable-logout' }).click(),
  ]);

  Cypress.env('accessToken', null);
  Cypress.env('refreshToken', null);
  cy.clearCookies();

  cy.expect(Button('Log in', { disabled: true }).exists());
});

Cypress.Commands.add('loginAsAdmin', (visitPath) => {
  cy.login(Cypress.env('login_username'), Cypress.env('login_password'), visitPath);
});
