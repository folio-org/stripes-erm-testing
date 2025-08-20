import { Accordion } from '@folio/stripes-testing';

/* Accordion "open" filter does not work as expected, content-region is "visible" when closed */

export default Accordion.extend('accordionNew')
  .filters({
    open: (el) => el.querySelector('button').getAttribute('aria-expanded') === 'true',
  });
