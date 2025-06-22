'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { syncUser } from '@/api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

export function UserSync() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const sync = async () => {
      if (isSignedIn && user && !isAuthenticated && !loading) {
        const token = await getToken();
        dispatch(syncUser({ clerkUser: user, token }));
      }
    };
    sync();
  }, [user, isSignedIn, isAuthenticated, loading, dispatch, getToken]);

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

export default UserSync; 