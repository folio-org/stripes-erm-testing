import { Bigtest } from '@folio/stripes-testing';

export default Bigtest.createInteractor('icon')
  .selector('[class^=icon-]')
  .locator((el) => el.textContent)
  .filters({
    textContent: (el) => el.textContent,
  });

export const IconElement = Bigtest.createInteractor('icon-element')
  .selector('[class^=stripes__icon]')
  .filters({
    // Get the icon name from the classlist
    icon: (el) => {
      // Take the classlist and find the icon-<iconName> class
      return el.classList.toString().split(' ').find(cn => cn.startsWith('icon-')).replace('icon-', '');
    }
  });
