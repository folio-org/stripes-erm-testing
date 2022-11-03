import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

import prefixKeys from './prefixKeys';
import mockOffsetSize from './mockOffsetSize';

import CalloutHarness from './CalloutHarness';

export default function Harness({
  children,
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
    <CalloutHarness>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          key="en"
          locale="en"
          messages={allTranslations}
          onError={() => {}}
          timeZone="UTC"
        >
          {children}
        </IntlProvider>
      </QueryClientProvider>
    </CalloutHarness>
  );
}

Harness.propTypes = {
  children: PropTypes.node,
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
