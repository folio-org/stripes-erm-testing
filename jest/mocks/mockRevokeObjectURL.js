const mockRevokeObjectURL = jest.fn();

global.URL.revokeObjectURL = mockRevokeObjectURL;

export default mockRevokeObjectURL;
