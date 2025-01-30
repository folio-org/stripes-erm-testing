/* eslint-disable react/prop-types */
import React from 'react';

const {
  Button: MockButton,
  KeyValue: MockKeyValue
} = jest.requireActual('@folio/stripes-components');

const mockTypedownGetter = (optionArray = []) => ({
  id,
  input: { onChange, value },
  renderFooter = () => {},
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

export default mockTypedownGetter;
