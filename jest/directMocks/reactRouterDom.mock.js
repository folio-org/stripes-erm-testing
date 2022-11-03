import { mockReactRouterDom } from '../mocks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  ...mockReactRouterDom
}));
