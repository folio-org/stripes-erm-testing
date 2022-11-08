import { mockStripesSmartComponents } from '../mocks';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ...mockStripesSmartComponents
}), { virtual: true });
