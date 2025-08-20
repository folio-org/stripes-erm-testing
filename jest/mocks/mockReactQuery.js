const invalidateQueries = jest.fn(input => input);
const setQueriesData = jest.fn((key, settingsFunc) => { return ({ key, settingsFunc }); });

const mockNaiveQueryReturn = {
  data: {},
  refetch: jest.fn(),
  isLoading: false
};

// A more in depth useQuery mock
const mockUseQuery = jest.fn((queryKey, queryFunc, queryOpts) => {
  // Ensure the queryFunc got run
  queryFunc();

  return ({
    queryKey,
    queryOpts,
    ...mockNaiveQueryReturn
  });
});


const mockReactQuery = {
  invalidateQueries,
  setQueriesData,
  mockNaiveQueryReturn,
  mockUseQuery, // Provide so it can be directly influenced
  // useQuery: jest.fn(() => ({ data: {}, refetch: jest.fn(), isLoading: false })),
  useQuery: mockUseQuery,
  useQueryClient: jest.fn(() => ({
    invalidateQueries,
    setQueriesData,
  })),
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn((_key, func) => ({
    mutateAsync: (...incomingParams) => {
      // Actually call function coming from component
      // This assumes that ky has been mocked, which it should have been by __mocks__ stripes-core.

      // If this function was async, we might need to do something different.
      // As it is, it's a synchronous call to ky which returns a promise we then chain on.
      return func(...incomingParams);
    },
    mutate: jest.fn()
  })),
};

export default mockReactQuery;
