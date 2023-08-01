
import { Selection } from '@folio/stripes-testing';
/* Selection id filter does not work as expected */

export default Selection.extend('selectionNew')
  .filters({
    id: (el) => el.querySelector('[class^=selectionControl]').id,
  });
