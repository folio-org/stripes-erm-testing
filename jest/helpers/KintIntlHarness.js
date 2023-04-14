const KintIntlHarness = ({ children, intlKey, moduleName }) => {
  const { useIntlKeyStore } = jest.requireActual('@k-int/stripes-kint-components');
  const addKey = useIntlKeyStore(state => state.addKey);
  addKey(intlKey, moduleName);

  return children;
};

export default KintIntlHarness;
