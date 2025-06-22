'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignList } from '@/components/Campaigns/CampaignList';
import { UTMLinkList } from '@/components/UTM/UTMLinkList';

function SearchResultsDisplay() {
  const { results, isLoading, error } = useSelector(
    (state: RootState) => state.search
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const { campaigns, utmLinks } = results;

  const hasResults = campaigns.length > 0 || utmLinks.length > 0;

  return (
    <div className="mt-4 space-y-4">
      {hasResults ? (
        <>
          {campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignList campaigns={campaigns} />
              </CardContent>
            </Card>
          )}
          {utmLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>UTM Links</CardTitle>
              </CardHeader>
              <CardContent>
                <UTMLinkList utmLinks={utmLinks} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p>No results found. Try a different search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SearchResultsDisplay; 