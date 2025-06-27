import userReducer, { fetchUserProfileThunk, updateUserProfileThunk, changeUserRoleThunk } from './userSlice';

describe('userSlice', () => {
  const initialState = { profile: null, loading: false, error: null };

  it('should handle initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchUserProfileThunk.pending', () => {
    const state = userReducer(initialState, { type: fetchUserProfileThunk.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUserProfileThunk.fulfilled', () => {
    const user = { id: '1', name: 'Test', role: 'Manager' };
    const state = userReducer(initialState, { type: fetchUserProfileThunk.fulfilled.type, payload: user });
    expect(state.loading).toBe(false);
    expect(state.profile).toEqual(user);
  });

  it('should handle updateUserProfileThunk.fulfilled', () => {
    const user = { id: '1', name: 'Test', role: 'Manager' };
    const state = userReducer(initialState, { type: updateUserProfileThunk.fulfilled.type, payload: user });
    expect(state.profile).toEqual(user);
  });

  it('should handle changeUserRoleThunk.fulfilled', () => {
    const user = { id: '1', name: 'Test', role: 'Viewer' };
    const stateWithProfile = { ...initialState, profile: user };
    const state = userReducer(stateWithProfile, { type: changeUserRoleThunk.fulfilled.type, payload: 'Manager' });
    expect(state.profile?.role).toBe('Manager');
  });
}); 