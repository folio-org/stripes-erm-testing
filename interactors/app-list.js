import { Button } from '@folio/stripes-testing';
import { HTML } from '@interactors/html';

const label = (el) => el.textContent.trim();

export const AppListItem = HTML.extend('App List Item')
.selector('[id^=app-list-item-clickable], [class^=NavListItem]')
  .locator(label)
  .filters({
    label,
    href: el => el.getAttribute('href'),
  });


export default HTML.extend('App List')
  .selector('[data-test-app-list]')
  .filters({
    count: el => el.querySelectorAll('a').length,
  })
  .actions({
    navTo: ({ find }, linkText) => {
      return find(AppListItem(linkText)).navTo(linkText);
    },
    openAppList: () => Button({ id: 'app-list-dropdown-toggle' }).click()
  });
