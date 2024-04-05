/* eslint-disable react/prop-types */
import { useState } from 'react';

import {
  Button as MockButton,
  KeyValue as MockKeyValue
} from '@folio/stripes/components';

/* If we need different mock behaviour in a given test we can use unmock like:

  jest.unmock('@k-int/stripes-kint-components');
  jest.mock('@k-int/stripes-kint-components', () => ({
    CustomPropertiesFilter: <Whatever mock implementation we wish>
  }));
*/

const getMockTypedown = (optionArray = []) => ({
  id,
  input: { onChange, value },
  renderFooter,
  renderListItem
}) => {
  return (
    <div>
      {`Typedown-${id}`}
      <MockKeyValue
        label={`Typedown-${id}-selected-option`}
        value={value ? renderListItem(value, '') : 'Nothing selected'}
      />
      {optionArray.map(seq => {
        return (
          <MockButton
            key={`Typedown-${id}-option-${seq.id}`}
            onClick={() => onChange(seq)}
          >
            {`Typedown-${id}-option-${seq.id}`}
          </MockButton>
        );
      })}
      {renderFooter()}
    </div>
  );
};

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
  EditableRefdataList: () => <div>EditableRefdataList</div>,
  Typedown: getMockTypedown()
};

export default mockKintComponents;
