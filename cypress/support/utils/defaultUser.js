import { getRandomPostfix } from './stringTools';

const defaultUserName = `AutotestUser${getRandomPostfix()}`;
const defaultUser = {
  username: defaultUserName,
  active: true,
  // should be defined
  barcode: undefined,
  personal: {
    preferredContactTypeId: '002',
    firstName: 'testFirstName',
    middleName: 'testMiddleName',
    lastName: defaultUserName,
    email: 'test@folio.org',
  },
  // should be defined
  patronGroup: undefined,
  departments: []
};

export default defaultUser;
