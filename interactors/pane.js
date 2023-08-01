import {
  Pane as PaneInteractor,
  PaneContent as PaneContentInteractor,
  PaneHeader as PaneHeaderInteractor,
  PaneSet as PaneSetInteractor
} from '@folio/stripes-testing';

export const PaneHeader = PaneHeaderInteractor.extend('pane header new')
  .selector('[data-test-pane-header]');

export const PaneSet = PaneSetInteractor.extend('pane set new')
  .selector('[class^=paneset]');

export const PaneContent = PaneContentInteractor.extend('pane content new')
  .selector('[class^=paneContent]');

export const Pane = PaneInteractor.extend('paneNew')
  .selector('section[class^=pane]');
