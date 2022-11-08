import { mockStripesCore } from '../mocks';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  ...mockStripesCore
}), { virtual: true });
