import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyId: string | null;
}

interface Company {
    id: string;
    name: string;
    domain: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  currentCompany: Company | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  currentCompany: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<UserProfile | null>) {
      state.currentUser = action.payload;
    },
    setCurrentCompany(state, action: PayloadAction<Company | null>) {
      state.currentCompany = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.currentCompany = null;
      state.token = null;
    },
  },
});

export const { setAuthState, setCurrentUser, setCurrentCompany, setToken, logout } = authSlice.actions;
export default authSlice.reducer; 