// TODO: Implement SEO component as per future task (see task_050.txt)
// This component will handle meta tags, Open Graph, and semantic HTML for SEO.
import React from 'react';
import Head from 'next/head';

export function SEO() {
  return (
    <Head>
      <title>Utmato | UTM Builder & Campaign Management for Marketers</title>
      <meta name="description" content="Utmato helps marketing teams create, track, and manage campaigns with consistent UTM links. The ultimate UTM builder and campaign metadata platform." />
      <meta name="keywords" content="UTM, Campaigns, Marketing, Performance Marketing, UTM Builder, Campaign Management, Attribution, Analytics" />
      <meta property="og:title" content="Utmato | UTM Builder & Campaign Management" />
      <meta property="og:description" content="Create, track, and manage campaigns with Utmato. Consistent UTM links, campaign metadata, and performance marketing tools." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://utmato.com/" />
      <meta property="og:image" content="/globe.svg" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Utmato | UTM Builder & Campaign Management" />
      <meta name="twitter:description" content="Create, track, and manage campaigns with Utmato. Consistent UTM links, campaign metadata, and performance marketing tools." />
      <meta name="twitter:image" content="/globe.svg" />
    </Head>
  );
} 