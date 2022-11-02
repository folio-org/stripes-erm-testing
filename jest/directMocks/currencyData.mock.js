// Annoyingly this is necessary for stripes-components
import { mockCurrencyData } from '../mocks';

jest.mock('currency-codes/data', () => mockCurrencyData);
