import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

import prefixKeys from './prefixKeys';
import mockOffsetSize from './mockOffsetSize';

import CalloutHarness from './CalloutHarness';
import ModuleHierarchyProvider from './ModuleHeirachyProvider';

const KintIntlHarness = ({ children, intlKey, moduleName }) => {
  const { useIntlKeyStore } = jest.requireActual('@k-int/stripes-kint-components');
  const addKey = useIntlKeyStore(state => state.addKey);
  addKey(intlKey, moduleName);

  return children;
};

export default function Harness({
  children,
  intlKey = 'ui-test-implementor',
  moduleName = '@folio/test-implementor',
  translations: translationsConfig,
  shouldMockOffsetSize = true,
  width = 500,
  height = 500,
}) {
  const queryClient = new QueryClient();
  const allTranslations = {};

  translationsConfig.forEach(tx => {
    Object.assign(allTranslations, prefixKeys(tx.translations, tx.prefix));
  });

  if (shouldMockOffsetSize) { // MCL autosize mock
    mockOffsetSize(width, height);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider
        key="en"
        locale="en"
        messages={allTranslations}
        onError={() => {}}
        timeZone="UTC"
      >
        <ModuleHierarchyProvider module={moduleName}>
          <CalloutHarness>
            <KintIntlHarness intlKey={intlKey} moduleName={moduleName}>
              {children}
            </KintIntlHarness>
          </CalloutHarness>
        </ModuleHierarchyProvider>
        <div id="OverlayContainer" /> {/* This is the div which the all overlays will render inside */}
      </IntlProvider>
    </QueryClientProvider>
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

Harness.defaultProps = {
  width: 500,
  height: 500,
  shouldMockOffsetSize: true,
};
