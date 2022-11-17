
import { Select } from '@folio/stripes-testing';
/* Select blur and chooseAndBlur does not work in stripes interactor */

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
  });