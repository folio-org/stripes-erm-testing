import { Bigtest } from '@folio/stripes-testing';

export default Bigtest.createInteractor('icon')
  .selector('[class^=icon-]')
  .locator((el) => el.textContent)
  .filters({
    textContent: (el) => el.textContent,
  });

const getIconFromClass = (el) => el.classList.toString().split(' ').find(cn => cn.startsWith('icon-')).replace('icon-', '');

export const IconElement = Bigtest.createInteractor('icon-element')
  .selector(':is([class^=spinner-][class*=stripes__icon], [class^=stripes__icon])') // spinner-ellipsis starts spinner- for some reason
  .locator(getIconFromClass)
  .filters({
    // Get the icon name from the classlist
    icon: getIconFromClass
  });
