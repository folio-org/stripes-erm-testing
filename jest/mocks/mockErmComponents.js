const mockErmComponents = {
  useTags: jest.fn().mockReturnValue({ data: { tags: [] } }),
  useBatchedFetch: jest.fn().mockReturnValue({ results: [], total: 0 }),
  useInfiniteFetch: jest.fn().mockReturnValue({
    infiniteQueryObject: {
      error: '',
      fetchNextPage: jest.fn(),
      isLoading: false,
      isError: false
    },
    results: [],
    total: 0
  }),
  useFileHandlers: jest.fn(() => ({
    handleDownloadFile: jest.fn(),
    handleUploadFile: jest.fn()
  })),
  useHandleSubmitSearch: jest.fn(() => ({
    handleSubmitSearch: jest.fn()
  })),
  useAsyncValidation: jest.fn(() => ''),
  handleSaveKeyCommand: jest.fn(),
  AlternativeNamesFieldArray: () => <div>AlternativeNamesFieldArray</div>,
  CustomMetaSection: () => <div>CustomMetaSection</div>,
  DateFilter: () => <div>DateFilter</div>,
  DocumentCard: () => <div>DocumentCard</div>,
  DocumentsFieldArray: () => <div>DocumentsFieldArray</div>,
  DuplicateModal: () => <div>DuplicateModal</div>,
  InternalContactCard: () => <div>InternalContactCard</div>,
  InternalContactSelection: () => <div>InternalContactSelection</div>,
  InternalContactsFieldArray: () => <div>InternalContactsFieldArray</div>,
  LicenseCard: () => <div>LicenseCard</div>,
  LicenseEndDate: () => <div>LicenseEndDate</div>,
  OrganizationSelection: () => <div>OrganizationSelection</div>,
  OrganizationsFieldArray: () => <div>OrganizationsFieldArray</div>,
  SerialCoverage: () => <div>SerialCoverage</div>,
  ViewOrganizationCard: () => <div>ViewOrganizationCard</div>,

};

export default mockErmComponents;
