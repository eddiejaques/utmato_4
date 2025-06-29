import { api } from './api';
import { Campaign } from '@/types/campaign';
import { UTMLink } from '@/types/utm';

interface SearchResults {
  campaigns: Campaign[];
  utmLinks: UTMLink[];
}

export const searchApi = {
  search: async (
    query: string,
    filters: Record<string, any>,
    token: string | null
  ): Promise<SearchResults> => {
    const params = { query, ...filters };
    const searchParams = new URLSearchParams(params).toString();
    return await api.get(`/search?${searchParams}`, token);
  },
  reverseUTMLookup: async (url: string, token: string | null): Promise<Campaign> => {
    return await api.post('/search/reverse-lookup', { url }, token);
  },
}; 