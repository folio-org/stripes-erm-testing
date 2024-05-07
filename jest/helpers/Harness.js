import React from 'react';
import PropTypes from 'prop-types';

import KintIntlHarness from './KintIntlHarness';
import BaseHarness from './BaseHarness';

export default function Harness({
  children,
  intlKey = 'ui-test-implementor',
  moduleName = '@folio/test-implementor',
  translations,
  shouldMockOffsetSize = true,
  width = 500,
  height = 500,
}) {
  return (
    <BaseHarness
      intlKey={intlKey}
      moduleName={moduleName}
      translations={translations}
      shouldMockOffsetSize={shouldMockOffsetSize}
      width={width}
      height={height}
    >
      <KintIntlHarness intlKey={intlKey} moduleName={moduleName}>
        {children}
      </KintIntlHarness>
    </BaseHarness>
  );
}

Harness.propTypes = {
  children: PropTypes.node,
  intlKey: PropTypes.string,
  moduleName: PropTypes.string,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
  shouldMockOffsetSize: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};
