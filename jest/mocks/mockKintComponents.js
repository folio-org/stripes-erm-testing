import { useState } from 'react';

/* If we need different mock behaviour in a given test we can use unmock like:

  jest.unmock('@k-int/stripes-kint-components');
  jest.mock('@k-int/stripes-kint-components', () => ({
    CustomPropertiesFilter: <Whatever mock implementation we wish>
  }));
*/

const mockKintComponents = {
  useIntlKeyStore:() => () => null,
  useRefdata: jest.fn().mockReturnValue([]),
  useQIndex: jest.fn(() => {
    return useState();
  }),
  useCustomProperties: jest.fn(({
    returnQueryObject = false
  }) => {
    let returnShape = [];
    if (returnQueryObject) {
      returnShape = {};
    }

    return ({ data: returnShape, isLoading: false });
  }),
  CustomPropertiesEdit: () => <div>CustomPropertiesEdit</div>,
  CustomPropertiesFilter: () => <div>CustomPropertiesFilter</div>,
  CustomPropertyCard: () => <div>CustomPropertyCard</div>,
  CustomPropertiesView: () => <div>CustomPropertiesView</div>,
  EditableRefdataCategoryList: () => <div>EditableRefdataCategoryList</div>,
  EditableRefdataList: () => <div>EditableRefdataList</div>
};

export default mockKintComponents;
