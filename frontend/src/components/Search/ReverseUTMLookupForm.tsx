'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchApi } from '@/api/search';
import {
  setSearchResults,
  setLoading,
  setError,
} from '@/store/searchSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@clerk/nextjs';

function ReverseUTMLookupForm() {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const token = await getToken({ template: 'fastapi_backend_template' });
      const campaign = await searchApi.reverseUTMLookup(url, token);
      dispatch(setSearchResults({ campaigns: [campaign], utmLinks: [] }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to find campaign.'));
      dispatch(setSearchResults({ campaigns: [], utmLinks: [] }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reverse UTM Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="utm-url">Paste UTM Link</Label>
            <Input
              id="utm-url"
              type="url"
              placeholder="https://example.com/?utm_..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Find Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReverseUTMLookupForm; 