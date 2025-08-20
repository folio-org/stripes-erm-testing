/* eslint-disable react/prop-types */
import React from 'react';
import { useCallout } from '../helpers/MockCalloutContext';

const STRIPES = {
  actionNames: [],
  clone: () => ({ ...STRIPES }),
  connect: (Component) => Component,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => { },
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => { },
  setCurrency: () => { },
  setLocale: () => { },
  setSinglePlugin: () => { },
  setTimezone: () => { },
  setToken: () => { },
  store: {
    getState: () => { },
    dispatch: () => { },
    subscribe: () => { },
    replaceReducer: () => { },
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

const stripesConnect = (Component, options) => ({ mutator, resources, stripes, ...rest }) => {
  const fakeMutator = mutator || (Component.manifest ? Object.keys(Component.manifest) : []).reduce((acc, mutatorName) => {
    const returnValue = Component.manifest[mutatorName].records ? [] : {};

    acc[mutatorName] = {
      GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
      PUT: jest.fn().mockReturnValue(Promise.resolve()),
      POST: jest.fn().mockReturnValue(Promise.resolve()),
      DELETE: jest.fn().mockReturnValue(Promise.resolve()),
      reset: jest.fn(),
    };

    return acc;
  }, {});

  const fakeResources = resources || (Component.manifest ? Object.keys(Component.manifest) : []).reduce((acc, resourceName) => {
    if (options?.resources?.[resourceName]) {
      acc[resourceName] = options.resources[resourceName];
    } else {
      acc[resourceName] = {
        records: [],
      };
    }

    return acc;
  }, {});

  const fakeStripes = stripes || STRIPES;
  return <Component {...rest} mutator={fakeMutator} resources={fakeResources} stripes={fakeStripes} />;
};

const withStripes = (Component, options) => ({ stripes, ...rest }) => {
  const fakeStripes = stripes || STRIPES;

  fakeStripes.connect = Comp => stripesConnect(Comp, options);

  return <Component {...rest} stripes={fakeStripes} />;
};

const mockKyJson = jest.fn(() => Promise.resolve({ id: 'some-id' }));
const mockKyText = jest.fn(() => Promise.resolve('{"id": "some-id"}'));

const mockBlob = { size: 12, type: 'text/plain' };
const mockKyBlob = jest.fn(() => Promise.resolve(mockBlob));

const mockKy = jest.fn((...input) => {
  const response = {
    input, // In case we want to inspect what was passed IN to ky.
    ok: true,
    status: 200,
    json: mockKyJson,
    text: mockKyText,
    blob: mockKyBlob,
  };

  return {
    ...response,
    then: jest.fn((callback) => {
      return Promise.resolve(response).then(resp => callback(resp));
    })
  };
});

// Decorate mockKy with special verbs
mockKy.get = jest.fn(mockKy);
mockKy.post = jest.fn(mockKy);
mockKy.put = jest.fn(mockKy);
mockKy.delete = jest.fn(mockKy);

const mockStripesCore = {
  // EXPOSE MOCKS USED INTERNALLY SO THEY CAN BE FIXED WITHIN TESTS INDEPENDENTLY
  mockKyJson,
  mockKyText,
  mockKyBlob,
  mockKy,
  stripesConnect,
  useChunkedCQLFetch: jest.fn().mockReturnValue({ items: [], isLoading: false, itemQueries: [] }),
  useStripes: jest.fn(() => STRIPES),
  useOkapiKy: jest.fn(() => mockKy),
  useCallout,
  withStripes,
  IfPermission: ({ children }) => {
    return typeof children === 'function' ?
      children({ hasPermission: true }) : <>{children}</>;
  },
  Pluggable: jest.fn(props => <>{props.children}</>),
  TitleManager: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  IfInterface: jest.fn(({ children }) => {
    return typeof children === 'function' ?
      children({ hasInterface: true }) : <>{children}</>;
  }),
  HandlerManager: jest.fn(() => <div>HandlerManager</div>),
};

export default mockStripesCore;
