import React from 'react';

const mockStripesIcon = jest.fn(({ children }) => (
  <span>
    <span>{children}</span>
  </span>
));

export default mockStripesIcon;
