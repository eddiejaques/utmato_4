'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setSearchQuery,
  addRecentSearch,
  setLoading,
  setError,
  setSearchResults,
} from '@/store/searchSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { searchApi } from '@/api/search';
import { useAuth } from '@clerk/nextjs';

function RecentSearches() {
  const dispatch = useDispatch();
  const { recentSearches, filters } = useSelector(
    (state: RootState) => state.search
  );
  const { getToken } = useAuth();

  const handleRecentSearchClick = async (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(addRecentSearch(query));
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const token = await getToken({ template: 'fastapi_backend_template' });
      const results = await searchApi.search(query, filters, token);
      dispatch(setSearchResults(results));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to search.'));
      dispatch(setSearchResults({ campaigns: [], utmLinks: [] }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
      </CardHeader>
      <CardContent>
        {recentSearches.length > 0 ? (
          <ul className="space-y-2">
            {recentSearches.map((query, index) => (
              <li key={index}>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleRecentSearchClick(query)}
                >
                  {query}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent searches.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentSearches; 