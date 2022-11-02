/* eslint-disable react/prop-types */
import React from 'react';

const mockStripesSmartComponents = {
  LocationLookup: () => <div>LocationLookup</div>,
  ViewMetaData: () => <div>ViewMetaData</div>,
  NotesSmartAccordion: () => <div>NotesSmartAccordion</div>,
  ControlledVocab: () => <div>ControlledVocab</div>,
  ConfigManager: () => <div>ConfigManager</div>,
  NoteCreatePage: () => <div>NoteCreatePage</div>,
  NoteEditPage: () => <div>NoteEditPage</div>,
  NoteViewPage: () => <div>NoteViewPage</div>,
  StripesConnectedSource: (props, logger, resourceName) => ({
    fetchMore: jest.fn(val => val),
    totalCount: () => props?.resources?.[resourceName]?.other?.totalRecords ?? undefined,
    update: jest.fn(),
    loaded: jest.fn(),
    records: () => props?.resources?.[resourceName]?.records ?? [],
    pending: () => jest.fn()
  })
};

export default mockStripesSmartComponents;
