import { Button, Select, TextField } from '@folio/stripes-testing';
import uuid from 'uuid';
import defaultUser from './utils/defaultUser';

Cypress.Commands.add('createUser', (userLastName, patronGroup, email) => {
  cy.do([
    TextField({ id: 'adduser_lastname' }).fillIn(userLastName),
    Select({ id: 'adduser_group' }).choose(patronGroup),
    TextField({ id: 'adduser_email' }).fillIn(email),
    Button({ id: 'clickable-save' }).click(),
  ]);
});

Cypress.Commands.add('createUserWithPwAndPerms', (userProperties, permissions, patronGroupName) => {
  cy.getAdminToken();

  cy.getFirstUserGroupId({ limit: patronGroupName ? 100 : 1 }, patronGroupName)
    .then((userGroupdId) => {
      const queryField = 'permissionName';
      const permissionsQuery = permissions.map(permission => `${queryField}=="${permission}"`).join(' or ');
      cy.getPermissionsApi({ query: `(${permissionsQuery})` })
        .then((permissionsResponse) => {
          cy.createUserViaApi({
            ...defaultUser,
            patronGroup: userGroupdId,
            username: userProperties.username,
            barcode: uuid(),
            personal: { ...defaultUser.personal, lastName: userProperties.username }
          })
            .then(newUserProperties => {
              userProperties.userId = newUserProperties.id;
              userProperties.barcode = newUserProperties.barcode;
              userProperties.firstName = newUserProperties.firstName;
              userProperties.lastName = newUserProperties.lastName;
              cy.setUserPassword(userProperties);
              cy.addPermissionsToNewUserApi({
                userId: userProperties.userId,
                permissions: [...permissionsResponse.body.permissions.map(permission => permission.permissionName)]
              });
              cy.overrideLocalSettings(userProperties.userId);
              cy.wrap(userProperties).as('userProperties');
            });
        });
    });
  return cy.get('@userProperties');
});

Cypress.Commands.add('deleteUserViaApi', (userId) => {
  cy.okapiRequest({
    method: 'DELETE',
    path: `bl-users/by-id/${userId}`,
    isDefaultSearchParamsRequired: false
  });
});

Cypress.Commands.add('createUserViaApi', (user) => {
  cy.okapiRequest({
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
