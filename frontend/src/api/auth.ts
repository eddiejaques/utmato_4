import { store } from '@/store';
import { setCurrentUser, setCurrentCompany } from '@/store/authSlice';
import { post } from './api';

export async function syncUser(clerkUser: any) {
  try {
    const syncData = {
      clerk_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress.emailAddress,
      first_name: clerkUser.firstName,
      last_name: clerkUser.lastName,
    };
    
    const data = await post<any>('/users/sync', syncData);

    // Dispatch actions to update Redux store
    store.dispatch(setCurrentUser(data.user));
    if (data.company) {
      store.dispatch(setCurrentCompany(data.company));
    }

    return data;
  } catch (error) {
    console.error('Error syncing user:', error);
    // Handle error appropriately in the UI
    throw error;
  }
} 