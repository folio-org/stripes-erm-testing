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
  useSettingSection: jest.fn(() => ({
    settings: [],
    handleSubmit: jest.fn()
  })),
  CustomPropertiesEdit: jest.fn(() => <div>CustomPropertiesEdit</div>),
  CustomPropertiesFilter: jest.fn(() => <div>CustomPropertiesFilter</div>),
  CustomPropertyCard: jest.fn(() => <div>CustomPropertyCard</div>),
  CustomPropertiesView: jest.fn(() => <div>CustomPropertiesView</div>),
  EditableRefdataCategoryList: jest.fn(() => <div>EditableRefdataCategoryList</div>),
  EditableRefdataList: jest.fn(() => <div>EditableRefdataList</div>)
};

export default mockKintComponents;
