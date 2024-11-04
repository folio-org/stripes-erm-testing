import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from './Harness';

const renderWithIntl = (
  children,
  translations = [],
  // DEPRECATED Would be a great breaking change to move renderer into extraOptions
  // DO that alongside expected breaking change upgrades in Sunflower
  /*
    * BREAKING CHANGE remove renderer as third option in renderWithIntl()
      * Instead it is an option in 3rd position "extraOptions" object
  */
  renderer = render,
  extraOptions = {
    mockWindowSize: true,
    // renderer: render,
  }
) => {
  // Defaulting
  const {
    intlKey,
    mockWindowSize = true,
    moduleName,
    // renderer = render
  } = extraOptions;

  if (mockWindowSize) {
    // Ensure we mock getBoundingClientRect when we need it
    window.HTMLElement.prototype.getBoundingClientRect = () => {
      return {
        width: 1920,
        height: 1080,
        top: 0,
        left: 0
      };
    };
  }

  return renderer(
    <Harness
      intlKey={intlKey}
      moduleName={moduleName}
      translations={translations}
    >
      {children}
    </Harness>
  );
};

export default renderWithIntl;
