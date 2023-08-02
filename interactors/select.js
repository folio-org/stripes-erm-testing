
import { Select } from '@folio/stripes-testing';
/* Select blur and chooseAndBlur does not work in stripes interactor */

// TODO not sure if the await is necessary here, since lint complains
// eslint-disable-next-line no-return-await
const blur = async (intr) => await intr.perform((el) => el.querySelector('select').blur());

export default Select.extend('selectNew')
  .actions({
    blur,
    chooseAndBlur: async (intr, value) => {
      // Make sure any action calls are async
      // Can grab actions from the extended interactor directly, and don't need to pass the interactor itself
      await intr.focus();
      await intr.choose(value);
      await blur(intr);
    }
  })
  .filters({
    selectedContent: el => {
      const selectElement = el.querySelector('select');
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      return selectedOption ? selectedOption.textContent : undefined;
    }
  });
