
import {
  MultiColumnList as MultiColumnListInteractor,
  MultiColumnListCell as MultiColumnListCellInteractor,
  MultiColumnListRow as MultiColumnListRowInteractor,
  MultiColumnListHeader as MultiColumnListHeaderInteractor,
} from '@folio/stripes-testing';
/* Selector classes are wrong, doesn't work */

export const MultiColumnListRow = MultiColumnListRowInteractor.extend('multi column list row new')
  .selector('[data-row-inner],[class^=mclRowFormatterContainer]');

export const MultiColumnListCell = MultiColumnListCellInteractor.extend('multi column list cell new')
  .selector('div[class*=mclCell]');

export const MultiColumnListHeader = MultiColumnListHeaderInteractor.extend('multi column list header new')
  .selector('div[class*=mclHeader]');

export const MultiColumnList = MultiColumnListInteractor.extend('multi column list new')
  .selector('div[class*=mclContainer]')
  .filters({
    columns: el => [...el.querySelectorAll('[id^=list-column-]')].map(x => x.textContent),
    rowCount: el => el.querySelectorAll('[class*=mclRow]').length,
    scrollTop: el => el.querySelector('div[class^=mclScrollable]').scrollTop,
    headerInteractivity: (el) => [...el.querySelectorAll('div[class*=mclHeader]')].map((d) => !!d.querySelector('[data-test-clickable-header]')),
  });
