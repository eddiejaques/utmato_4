import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import { fetchUserProfile, updateUserProfile, changeUserRole } from '@/api/user';

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfileThunk = createAsyncThunk<User, string | undefined, { rejectValue: string }>(
  'user/fetchProfile',
  async (token, thunkAPI) => {
    try {
      return await fetchUserProfile(token);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk('user/updateProfile', async (profile: Partial<User>, { rejectWithValue }) => {
  try {
    return await updateUserProfile(profile);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const changeUserRoleThunk = createAsyncThunk('user/changeRole', async (role: string, { rejectWithValue }) => {
  try {
    return await changeUserRole(role);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.profile = action.payload;
      })
      .addCase(changeUserRoleThunk.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.profile) state.profile.role = action.payload;
      });
  },
});

export default userSlice.reducer; 