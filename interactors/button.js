
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button } from '@folio/stripes-testing';
/*
  EXAMPLE -- DO NOT EXPORT THIS YET

  We could replace interactions at this level to avoid the waitFor across all tests.
  However we would need to do this across most all interactors,
  and that work probably belongs in stripes-testing
*/

export default Button.extend('buttonNew')
  .actions({
    click: (({ perform }) => {
      return waitFor(async () => {
        await perform(el => el.click());
      });
    })
  });
