/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const {
  Button: MockButton,
  KeyValue: MockKeyValue,
  TextField: MockTextField,
} = jest.requireActual('@folio/stripes-components');

const mockTypedownGetter = (optionArray = []) => ({
  id,
  input: { onChange, value },
  onType,
  renderFooter = () => {},
  renderListItem
}) => {
  const [typed, setTyped] = useState('');


  return (
    <div>
      {`Typedown-${id}`}
      <MockTextField
        label={`Typedown-${id}-textfield`}
        onChange={e => {
          onType(e);
          setTyped(e.target.value);
        }}
        value={typed}
      />
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
            {renderListItem(seq)}
          </MockButton>
        );
      })}
      {renderFooter()}
    </div>
  );
};

export default mockTypedownGetter;
