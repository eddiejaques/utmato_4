'use client';

import React from 'react';
import SearchBar from '@/components/Search/SearchBar';
import SearchFilters from '@/components/Search/SearchFilters';
import SearchResultsDisplay from '@/components/Search/SearchResultsDisplay';
import ReverseUTMLookupForm from '@/components/Search/ReverseUTMLookupForm';
import RecentSearches from '@/components/Search/RecentSearches';

function SearchPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <SearchBar />
          <SearchResultsDisplay />
        </div>
        <div className="space-y-4">
          <SearchFilters />
          <ReverseUTMLookupForm />
          <RecentSearches />
        </div>
      </div>
    </div>
  );
}

export default SearchPage; 