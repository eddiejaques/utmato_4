import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from './api';
import { User } from '@/types/user'; 
import { Company } from '@/types/company';

interface SyncUserData {
  user: User;
  company: Company | null;
  token: string | null;
}

interface SyncUserArgs {
  clerkUser: any;
  token: string | null;
}

// Define the async thunk
export const syncUser = createAsyncThunk<
  SyncUserData, // Return type of the payload creator
  SyncUserArgs, // Arguments to the payload creator
  { rejectValue: string } // Types for thunkAPI
>('auth/syncUser', async ({ clerkUser, token }, { rejectWithValue }) => {
  try {
    const syncData = {
      clerk_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress.emailAddress,
      first_name: clerkUser.firstName,
      last_name: clerkUser.lastName,
      image_url: clerkUser.imageUrl
    };
    
    const data = await post<SyncUserData>('/users/sync', syncData);
    return { ...data, token };
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return rejectWithValue(error.response?.data?.detail || 'Failed to sync user');
  }
}); 