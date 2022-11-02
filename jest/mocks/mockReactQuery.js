const mockReactQuery = {
  useQuery: jest.fn(() => ({ data: {}, refetch: jest.fn(), isLoading: false })),
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn(() => ({
    mutateAsync: jest.fn(async () => Promise.resolve({
      ok: true,
      text: jest.fn(() => 'text'),
      json: jest.fn(() => ({ id: 'someId' }))
    })),
    mutate: jest.fn()
  }))
};

export default mockReactQuery;
