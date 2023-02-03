import React from 'react';
import { render } from '@testing-library/react';

import Harness from './Harness';

const renderWithIntl = (children, translations = [], renderer = render, extraOptions = {}) => renderer(
  <Harness
    intlKey={extraOptions.intlKey}
    moduleName={extraOptions.moduleName}
    translations={translations}
  >
    {children}
  </Harness>
);

export default renderWithIntl;
