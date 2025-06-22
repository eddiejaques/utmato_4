import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import { Company } from '@/types/company';
import { syncUser } from '@/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  company: Company | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  company: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.company = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.company = action.payload.company;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthState, setToken, logout } = authSlice.actions;

export default authSlice.reducer; 