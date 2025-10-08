const mockErmComponents = {
  useTags: jest.fn().mockReturnValue({ data: { tags: [] } }),
  useBatchedFetch: jest.fn().mockReturnValue({ results: [], total: 0 }),
  useParallelBatchFetch: jest.fn().mockReturnValue({ items: [], total: 0 }),
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
  useChunkedCQLFetch: jest.fn().mockReturnValue({ items: [], isLoading: false, itemQueries: [] }),
  useFileHandlers: jest.fn(() => ({
    handleDownloadFile: jest.fn(),
    handleUploadFile: jest.fn()
  })),
  useHandleSubmitSearch: jest.fn(() => ({
    handleSubmitSearch: jest.fn()
  })),
  useAsyncValidation: jest.fn(() => ''),
  handleSaveKeyCommand: jest.fn(),
  AlternativeNamesFieldArray: jest.fn(() => <div>AlternativeNamesFieldArray</div>),
  CustomMetaSection: jest.fn(() => <div>CustomMetaSection</div>),
  DateFilter: jest.fn(() => <div>DateFilter</div>),
  DocumentCard: jest.fn(() => <div>DocumentCard</div>),
  DocumentsFieldArray: jest.fn(() => <div>DocumentsFieldArray</div>),
  DuplicateModal: jest.fn(() => <div>DuplicateModal</div>),
  InternalContactCard: jest.fn(() => <div>InternalContactCard</div>),
  InternalContactSelection: jest.fn(() => <div>InternalContactSelection</div>),
  InternalContactsFieldArray: jest.fn(() => <div>InternalContactsFieldArray</div>),
  LicenseCard: jest.fn(() => <div>LicenseCard</div>),
  LicenseEndDate: jest.fn(() => <div>LicenseEndDate</div>),
  OrganizationSelection: jest.fn(() => <div>OrganizationSelection</div>),
  OrganizationsFieldArray: jest.fn(() => <div>OrganizationsFieldArray</div>),
  SerialCoverage: jest.fn(() => <div>SerialCoverage</div>),
  ViewOrganizationCard: jest.fn(() => <div>ViewOrganizationCard</div>),
  Logs: jest.fn(() => <div>Logs</div>),
  usePolicies: jest.fn(() => ({ policies: [] })),
  useGetAccess: jest.fn(() => ({
    canCreate: true,
    canCreateLoading: false,
    canCreateQuery: true,
    canRead: true,
    canReadLoading: false,
    canReadQuery: true,
    canEdit: true,
    canEditLoading: false,
    canEditQuery: true,
    canDelete: true,
    canDeleteLoading: false,
    canDeleteQuery: true,
    canApplyPolicies: true,
    canApplyPoliciesLoading: false,
    canApplyPoliciesQuery: true
  }))
};

export default mockErmComponents;
