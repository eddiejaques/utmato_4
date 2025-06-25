import teamReducer, { fetchTeamThunk, inviteUserThunk, acceptInviteThunk, rejectInviteThunk, removeUserThunk, updateUserRoleThunk } from './teamSlice';

describe('teamSlice', () => {
  const initialState = { members: [], invites: [], loading: false, error: null };

  it('should handle initial state', () => {
    expect(teamReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchTeamThunk.pending', () => {
    const state = teamReducer(initialState, { type: fetchTeamThunk.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchTeamThunk.fulfilled', () => {
    const payload = { members: [{ id: '1', name: 'A', role: 'Manager' }], invites: [] };
    const state = teamReducer(initialState, { type: fetchTeamThunk.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.members).toHaveLength(1);
  });

  it('should handle inviteUserThunk.fulfilled', () => {
    const invite = { id: 'inv1', email: 'test@example.com', role: 'Viewer' };
    const state = teamReducer(initialState, { type: inviteUserThunk.fulfilled.type, payload: invite });
    expect(state.invites).toContain(invite);
  });

  it('should handle acceptInviteThunk.fulfilled', () => {
    const invite = { id: 'inv1', email: 'test@example.com', role: 'Viewer' };
    const member = { id: 'inv1', name: 'Test', role: 'Viewer' };
    const stateWithInvite = { ...initialState, invites: [invite] };
    const state = teamReducer(stateWithInvite, { type: acceptInviteThunk.fulfilled.type, payload: member });
    expect(state.members).toContain(member);
    expect(state.invites).not.toContain(invite);
  });

  it('should handle rejectInviteThunk.fulfilled', () => {
    const invite = { id: 'inv1', email: 'test@example.com', role: 'Viewer' };
    const stateWithInvite = { ...initialState, invites: [invite] };
    const state = teamReducer(stateWithInvite, { type: rejectInviteThunk.fulfilled.type, payload: 'inv1' });
    expect(state.invites).toHaveLength(0);
  });

  it('should handle removeUserThunk.fulfilled', () => {
    const member = { id: '1', name: 'A', role: 'Manager' };
    const stateWithMember = { ...initialState, members: [member] };
    const state = teamReducer(stateWithMember, { type: removeUserThunk.fulfilled.type, payload: '1' });
    expect(state.members).toHaveLength(0);
  });

  it('should handle updateUserRoleThunk.fulfilled', () => {
    const member = { id: '1', name: 'A', role: 'Viewer' };
    const stateWithMember = { ...initialState, members: [member] };
    const state = teamReducer(stateWithMember, { type: updateUserRoleThunk.fulfilled.type, payload: { userId: '1', role: 'Manager' } });
    expect(state.members[0].role).toBe('Manager');
  });
}); 