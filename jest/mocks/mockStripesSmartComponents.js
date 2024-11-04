/* eslint-disable react/prop-types */
import React from 'react';

const mockStripesSmartComponents = {
  LocationLookup: jest.fn(() => <div>LocationLookup</div>),
  ViewMetaData: jest.fn(() => <div>ViewMetaData</div>),
  NotesSmartAccordion: jest.fn(() => <div>NotesSmartAccordion</div>),
  ColumnManagerMenu: jest.fn(() => <div>ColumnManagerMenu</div>),
  ControlledVocab: jest.fn(() => <div>ControlledVocab</div>),
  ConfigManager: jest.fn(() => <div>ConfigManager</div>),
  NoteCreatePage: jest.fn(() => <div>NoteCreatePage</div>),
  NoteEditPage: jest.fn(() => <div>NoteEditPage</div>),
  NoteViewPage: jest.fn(() => <div>NoteViewPage</div>),
  StripesConnectedSource: jest.fn((props, logger, resourceName) => ({
    fetchMore: jest.fn(val => val),
    totalCount: () => props?.resources?.[resourceName]?.other?.totalRecords ?? undefined,
    update: jest.fn(),
    loaded: jest.fn(),
    records: () => props?.resources?.[resourceName]?.records ?? [],
    pending: () => jest.fn()
  }))
};

export default mockStripesSmartComponents;
