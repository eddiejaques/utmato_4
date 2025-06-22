'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { syncUser } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/store/authSlice';

export function UserSync() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    async function sync() {
      if (isSignedIn && user) {
        try {
          const token = await getToken({ template: 'supabase' }); // or your custom template
          if (token) {
            await syncUser(user, token);
            dispatch(setAuthState(true));
          }
        } catch (error) {
          console.error('Failed to sync user or get token:', error);
          dispatch(setAuthState(false));
        }
      } else {
        dispatch(setAuthState(false));
      }
    }

    sync();
  }, [isSignedIn, user, getToken, dispatch]);

  return null; // This component does not render anything
} 