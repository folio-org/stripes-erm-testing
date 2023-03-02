import { HTML, Link } from '@interactors/html';

function label(element) {
  const labelEl = element.querySelector('[class^=AppListItem]');
  return labelEl ? labelEl.textContent.trim() : '';
}

export default HTML.extend('App List')
  .selector('[data-test-app-list]')
  .filters({
    count: el => el.querySelectorAll('a').length,
  })
  .actions({
    navTo: ({ find }, linkText) => find(Link(linkText)).click(),
  });

export const AppListItem = HTML.extend('App List Item')
  .selector('[class^=navItem]')
  .filters({
    label,
    href: el => el.getAttribute('href'),
  });
