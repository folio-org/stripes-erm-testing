import { mockReactQuery } from '../mocks';

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  ...mockReactQuery
}));
