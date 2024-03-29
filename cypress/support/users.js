import uuid from 'uuid';

import {
  Button,
  Select,
  TextField
} from '../../interactors';

import defaultUser from './utils/defaultUser';

Cypress.Commands.add('createUser', (userLastName, patronGroup, email) => {
  cy.do([
    TextField({ id: 'adduser_lastname' }).fillIn(userLastName),
    Select({ id: 'adduser_group' }).choose(patronGroup),
    TextField({ id: 'adduser_email' }).fillIn(email),
    Button({ id: 'clickable-save' }).click(),
  ]);
});

Cypress.Commands.add('createUserViaApi', ({ user, headers }) => {
  cy.okapiRequest({
    headers,
    method: 'POST',
    path: 'users',
    body: user,
    isDefaultSearchParamsRequired: false
  }).then(response => ({
    id: response.body.id,
    username: response.body.username,
    barcode: response.body.barcode,
    lastName: response.body.personal.lastName,
    firstName: response.body.personal.firstName,
    middleName: response.body.personal.middleName
  }));
});

// This usually happens outside of logged in env
// For use with a specific user login token, run `getToken` first and pass runWithAdminToken: false
Cypress.Commands.add('deleteUserViaApi', ({
  userId,
  runWithAdminToken = true
}) => {
  // Ensure cookie gets set with admin access token
  if (runWithAdminToken) {
    cy.getAdminToken();
  }

  cy.okapiRequest({
    method: 'DELETE',
    path: `bl-users/by-id/${userId}`,
    isDefaultSearchParamsRequired: false,
  });
});

// This usually happens outside of logged in env
// For use with a specific user login token, run `getToken` first and pass runWithAdminToken: false
Cypress.Commands.add('createUserWithPwAndPerms', ({
  userProperties,
  permissions,
  patronGroupName,
  runWithAdminToken = true
}) => {
  // Ensure cookie gets set with admin access token
  if (runWithAdminToken) {
    cy.getAdminToken();
  }

  cy.getFirstUserGroupId({ limit: patronGroupName ? 100 : 1 }, patronGroupName)
    .then((userGroupdId) => {
      const queryField = 'permissionName';
      const permissionsQuery = permissions.map(permission => `${queryField}=="${permission}"`).join(' or ');
      cy.getPermissionsApi({
        searchParams: { query: `(${permissionsQuery})` },
      })
        .then((permissionsResponse) => {
          cy.createUserViaApi({
            user: {
              ...defaultUser,
              patronGroup: userGroupdId,
              username: userProperties.username,
              barcode: uuid(),
              personal: { ...defaultUser.personal, lastName: userProperties.username }
            },
          }).then(newUserProperties => {
            userProperties.userId = newUserProperties.id;
            userProperties.barcode = newUserProperties.barcode;
            userProperties.firstName = newUserProperties.firstName;
            userProperties.lastName = newUserProperties.lastName;
            cy.setUserPassword({
              userCredentials: userProperties,
            });
            cy.addPermissionsToNewUserApi({
              userAndPermissions: {
                userId: userProperties.userId,
                permissions: [...permissionsResponse.body.permissions.map(permission => permission.permissionName)]
              },
            });
            cy.overrideLocalSettings(userProperties.userId);
            cy.wrap(userProperties).as('userProperties');
          });
        });
    });
  return cy.get('@userProperties');
});
