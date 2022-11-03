const mockReactRouterDom = {
  useLocation: jest.fn().mockReturnValue({}),
  useHistory: jest.fn(() => ({ push: jest.fn(() => null) })),
  useParams: jest.fn().mockReturnValue({})
};

export default mockReactRouterDom;
