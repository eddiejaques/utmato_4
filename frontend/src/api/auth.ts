import { store } from '@/store';
import { setCurrentUser, setCurrentCompany } from '@/store/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function syncUser(clerkUser: any, token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to sync user');
    }

    const data = await response.json();
    
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