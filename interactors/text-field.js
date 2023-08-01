import { TextField } from '@folio/stripes-testing';
/* TextField selector doesn't work */

const label = (el) => {
  let labelEl = el.querySelector('label');
  const input = el.querySelector('input');
  if (!labelEl) labelEl = input ? (input.labels || [])[0] : null;
  return labelEl ? labelEl.textContent : input?.getAttribute('aria-label') || '';
};

export default TextField.extend('text field new')
  .selector('div[class^=textField]')
  .locator(label)
  .filters({
    id: (el) => el.querySelector('input')?.id,
  });

