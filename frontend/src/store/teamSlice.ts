import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TeamMember, Invite } from '@/types/user';
import { fetchTeam, inviteUser, acceptInvite, rejectInvite, removeUser, updateUserRole } from '@/api/team';

interface TeamState {
  members: TeamMember[];
  invites: Invite[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
  invites: [],
  loading: false,
  error: null,
};

export const fetchTeamThunk = createAsyncThunk('team/fetchTeam', async (_, { rejectWithValue }) => {
  try {
    return await fetchTeam();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const inviteUserThunk = createAsyncThunk('team/inviteUser', async (payload: { email: string; role: string }, { rejectWithValue }) => {
  try {
    return await inviteUser(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const acceptInviteThunk = createAsyncThunk('team/acceptInvite', async (inviteId: string, { rejectWithValue }) => {
  try {
    return await acceptInvite(inviteId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const rejectInviteThunk = createAsyncThunk('team/rejectInvite', async (inviteId: string, { rejectWithValue }) => {
  try {
    return await rejectInvite(inviteId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const removeUserThunk = createAsyncThunk('team/removeUser', async (userId: string, { rejectWithValue }) => {
  try {
    return await removeUser(userId);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateUserRoleThunk = createAsyncThunk('team/updateUserRole', async (payload: { userId: string; role: string }, { rejectWithValue }) => {
  try {
    return await updateUserRole(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamThunk.fulfilled, (state, action: PayloadAction<{ members: TeamMember[]; invites: Invite[] }>) => {
        state.loading = false;
        state.members = action.payload.members;
        state.invites = action.payload.invites;
      })
      .addCase(fetchTeamThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(inviteUserThunk.fulfilled, (state, action: PayloadAction<Invite>) => {
        state.invites.push(action.payload);
      })
      .addCase(acceptInviteThunk.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.members.push(action.payload);
        state.invites = state.invites.filter(invite => invite.id !== action.payload.id);
      })
      .addCase(rejectInviteThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.invites = state.invites.filter(invite => invite.id !== action.payload);
      })
      .addCase(removeUserThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.members = state.members.filter(member => member.id !== action.payload);
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action: PayloadAction<{ userId: string; role: string }>) => {
        const member = state.members.find(m => m.id === action.payload.userId);
        if (member) member.role = action.payload.role;
      });
  },
});

export default teamSlice.reducer; 