import { HTML, including } from '@interactors/html';
import {
  Button,
  MultiSelect,
  MultiSelectMenu,
} from '@folio/stripes-testing';
/* MultiSelect selector doesn't work */

export const MultiSelectOption = HTML.extend('multi select option new')
  .selector('[class^=multiSelectOption]')
  .locator(el => {
    let str = el.textContent || '';
    str = str.replace(/[+-]$/, '');
    return str;
  })
  .filters({
    cursored: (el) => el.className.includes('cursor'),
    index: (el) => [...el.parentNode.children].indexOf(el),
    selected: (el) => el.className.includes('selected'),
    innerHTML: (el) => el.innerHTML,
  });

// This is copied from stripes-testing
const select = async (interactor, values) => {
  await interactor.open();
  let valuesParam = values;
  if (typeof values === 'string') {
    valuesParam = [values];
  }
  for (const value of valuesParam) {
    await MultiSelectMenu().find(MultiSelectOption(value)).click();
  }

  await interactor.close();
};

export default MultiSelect.extend('multi select new')
  .selector('[role=application][class^=multiSelectContainer]')
  .actions({
    choose: select,
    select,
    toggle: ({ find }) => find(Button({ className: including('multiSelectToggleButton') })).click()
  });


