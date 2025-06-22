import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign } from '@/types/campaign';
import { UTMLink } from '@/types/utm';

interface SearchState {
  query: string;
  results: {
    campaigns: Campaign[];
    utmLinks: UTMLink[];
  };
  filters: {
    status: string;
    source: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: {
    campaigns: [],
    utmLinks: [],
  },
  filters: {
    status: '',
    source: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  recentSearches: [],
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setSearchResults(
      state,
      action: PayloadAction<{ campaigns: Campaign[]; utmLinks: UTMLink[] }>
    ) {
      state.results = action.payload;
    },
    setSearchFilters(
      state,
      action: PayloadAction<{ status?: string; source?: string }>
    ) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      const newSearch = action.payload;
      if (!state.recentSearches.includes(newSearch)) {
        state.recentSearches.unshift(newSearch);
        if (state.recentSearches.length > 10) {
          state.recentSearches.pop();
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setSearchFilters,
  setSearchPage,
  addRecentSearch,
  setLoading,
  setError,
} = searchSlice.actions;

export default searchSlice.reducer; 