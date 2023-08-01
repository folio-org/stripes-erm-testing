
import { Checkbox } from '@folio/stripes-testing';
/* Checkbox locator doesn't work */

export default Checkbox.extend('checkboxNew')
  .selector('div[class^=checkbox]')
  .locator((el) => {
    const labelText = el.querySelector('[class^=labelText]');
    const input = el.querySelector('input');
    if (labelText) {
      return labelText.textContent;
    }

    return input.getAttribute('aria-label') || '';
  });
