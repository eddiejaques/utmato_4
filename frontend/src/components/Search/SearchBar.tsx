'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setSearchQuery,
  addRecentSearch,
  setLoading,
  setError,
  setSearchResults,
} from '@/store/searchSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchApi } from '@/api/search';
import { useAuth } from '@clerk/nextjs';

function SearchBar() {
  const { query, filters } = useSelector((state: RootState) => state.search);
  const [localQuery, setLocalQuery] = useState(query);
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(setSearchQuery(localQuery));
      dispatch(addRecentSearch(localQuery));
      
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const token = await getToken({ template: 'fastapi_backend_template' });
        const results = await searchApi.search(localQuery, filters, token);
        dispatch(setSearchResults(results));
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to search.'));
        dispatch(setSearchResults({ campaigns: [], utmLinks: [] }));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="Search for campaigns or UTM links..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}

export default SearchBar; 