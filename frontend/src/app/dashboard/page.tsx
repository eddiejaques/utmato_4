'use client';

import { CampaignList } from "@/components/Campaigns/CampaignList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Header } from "@/components/organisms/Header";
import { SignedIn } from "@clerk/nextjs";
import Link from 'next/link';
import { Icon } from '@/components/atoms/Icon';

export default function DashboardPage() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading || !isAuthenticated) {
    return <div>Loading session...</div>;
  }

  const UserProfileIconLink = (
    <Link href="/user-profile" aria-label="Go to profile" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
      <Icon size={28} title="Profile">
        <circle cx="14" cy="10" r="4" />
        <path d="M4 22c0-4 8-4 8-4s8 0 8 4" stroke="currentColor" strokeWidth="2" fill="none" />
      </Icon>
    </Link>
  );

  return (
    <>
      <SignedIn>
        <Header userProfile={UserProfileIconLink} searchValue="" onSearchChange={() => {}} onSearch={() => {}} />
      </SignedIn>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
        <CampaignList />
      </div>
    </>
  );
} 