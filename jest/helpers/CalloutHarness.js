/**
 * CalloutHarness
 *
 * Wrapper component that can be used for testing
 * components that rely on a callout.
 */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Callout } from '@folio/stripes-components';

import { CalloutContext } from './MockCalloutContext';

/*
  IMPORTANT it is imperative that this Harness is used in conjunction with a div
  <div id='OverlayContainer'/>
  To allow callouts to render to the DOM.
  In our case this div is provided by Harness
*/
const CalloutHarness = ({ children }) => {
  const [callout, setCallout] = useState(null);
  const setCalloutRef = (ref) => {
    setCallout(ref);
  };

  return (
    <>
      <CalloutContext.Provider value={callout}>
        {children}
        <Callout ref={setCalloutRef} />
      </CalloutContext.Provider>
    </>
  );
};
 
CalloutHarness.propTypes = {
  children: PropTypes.node,
};

export default CalloutHarness;