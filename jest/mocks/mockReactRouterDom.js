const mockReactRouterDom = {
  useLocation: jest.fn().mockReturnValue({}),
  useHistory: jest.fn(() => ({
    replace: jest.fn(() => null),
    push: jest.fn(() => null)
  })),
  useParams: jest.fn().mockReturnValue({})
};

export default mockReactRouterDom;
