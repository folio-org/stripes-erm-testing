import { mockStripesConfig } from '../mocks';

jest.mock('stripes-config', () => mockStripesConfig, { virtual: true });
