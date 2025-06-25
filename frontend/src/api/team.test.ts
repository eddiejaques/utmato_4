import { fetchPendingInvites } from './team';

// Mock the api.get function
jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const { api } = require('./api');

describe('fetchPendingInvites', () => {
  it('calls the correct endpoint and returns invites', async () => {
    const mockInvites = [
      { id: '1', email: 'test1@example.com', role: 'MEMBER' },
      { id: '2', email: 'test2@example.com', role: 'VIEWER' },
    ];
    (api.get as jest.Mock).mockResolvedValueOnce(mockInvites);
    const companyId = 'company-123';
    const token = 'token-abc';
    const result = await fetchPendingInvites(companyId, token);
    expect(api.get).toHaveBeenCalledWith(`/invitations/list/${companyId}`, token);
    expect(result).toEqual(mockInvites);
  });
}); 