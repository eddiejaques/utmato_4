'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { syncUser } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { setAuthState, setToken } from '@/store/authSlice';

export function UserSync() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    async function sync() {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          if (token) {
            dispatch(setToken(token));
            await syncUser(user);
            dispatch(setAuthState(true));
          }
        } catch (error) {
          console.error('Failed to sync user or get token:', error);
          dispatch(setAuthState(false));
          dispatch(setToken(null));
        }
      } else {
        dispatch(setAuthState(false));
        dispatch(setToken(null));
      }
    }

    sync();
  }, [isSignedIn, user, getToken, dispatch]);

  // Log the JWT in development for API testing
  useEffect(() => {
    const logToken = async () => {
      if (process.env.NODE_ENV === 'development' && isSignedIn) {
        const token = await getToken();
        console.log('CLERK JWT (for API testing):', token);
      }
    };
    logToken();
  }, [isSignedIn, getToken]);

  return null; // This component does not render anything
} 